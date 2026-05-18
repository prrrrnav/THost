import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Bell, Building, PlusCircle, Zap, Building2, ChevronRight, Wallet, Sparkles, Users, TrendingUp, TrendingDown, Clock, Check, UserPlus, Receipt } from "@/lib/icons";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/context/LocalizationContext";
import { supabase } from "@/lib/supabase";

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }: any) {
  const { profile, selectedProperty, setSelectedProperty } = useAuth();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [pgs, setPgs] = useState<any[]>([]);
  const [totalCollected, setTotalCollected] = useState(0);
  const [totalTenants, setTotalTenants] = useState(0);
  const [totalBeds, setTotalBeds] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [pendingRent, setPendingRent] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (profile?.id) {
        fetchDashboardData();
      }
    }, [profile?.id, selectedProperty?.id])
  );

  const fetchDashboardData = async () => {
    if (!profile?.id) return;
    try {
      setLoading(true);
      // 1. Fetch PG properties
      const { data: pgData, error: pgError } = await supabase
        .from("pg_details")
        .select("*")
        .eq("owner_id", profile.id);

      if (pgError) throw pgError;
      const properties = pgData || [];
      setPgs(properties);

      // Calculate total beds from selected property
      const targetPgId = selectedProperty?.id;
      const beds = selectedProperty?.total_beds || 0;
      setTotalBeds(beds);

      // 2. Fetch all dashboard metrics in a single optimized RPC call
      if (targetPgId) {
        const { data: metricsData, error: metricsError } = await supabase
          .rpc('get_dashboard_metrics', { p_pg_id: targetPgId });
          
        if (!metricsError && metricsData) {
          setTotalExpenses(Number(metricsData.total_expenses || 0));
          if (metricsData.total_beds > 0) {
            setTotalBeds(Number(metricsData.total_beds || 0));
          }
        } else {
          console.error("Dashboard metrics RPC error:", metricsError);
        }

        // 3. Fetch tenants directly to calculate Collected, Occupancy, Revenue and Pending
        // this aligns perfectly with the payments page finance summary
        const { data: tenantsData, error: tenantsError } = await supabase
          .from("tenants")
          .select("*")
          .eq("pg_id", targetPgId);

        if (!tenantsError && tenantsData) {
          let collected = 0;
          let expected = 0;
          let pendingSum = 0;
          let occupiedCount = tenantsData.length;

          tenantsData.forEach(t => {
            const rent = Number(t.rent_amount || 0);
            expected += rent;
            if (t.status === "Paid") {
              collected += rent;
            } else if (t.status === "Pending" || t.status === "Due" || t.status === "Unpaid") {
              pendingSum += rent;
            }
          });

          setTotalCollected(collected);
          setMonthlyRevenue(expected);
          setPendingRent(pendingSum);
          setTotalTenants(occupiedCount);
        } else if (tenantsError) {
          console.error("Dashboard tenants fetch error:", tenantsError);
        }
      }

      // 4. Fetch transactions for the selected property from pg_transactions
      const formattedTx: any[] = [];
      setPage(1);
      
      if (targetPgId) {
        const { data: payData, error: payError } = await supabase
          .from("pg_transactions")
          .select(`*`)
          .eq("pg_id", targetPgId)
          .order("created_at", { ascending: false })
          .limit(5);
        
        if (!payError && payData) {
          setHasMore(payData.length === 5);
          payData.forEach((p: any) => {
              const isExpense = p.type === "Expense";
              formattedTx.push({
                id: p.id,
                title: p.title || (isExpense ? "Other Expense" : "Rent Payment"),
                date: new Date(p.created_at).toLocaleDateString(),
                time: new Date(p.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                amount: `${isExpense ? "- " : ""}₹${p.amount}`,
                status: isExpense ? "Expense" : (p.status === "Paid" ? "+ Paid" : p.status),
                color: isExpense ? "#FFCDD2" : (p.status === "Paid" ? "#CCFF00" : (p.status === "Unpaid" ? "#FFCDD2" : "#FFF9C4")),
                isPositive: !isExpense && p.status === "Paid",
                isExpense: isExpense
              });
          });
        }
      }

      setTransactions(formattedTx);
    } catch (error: any) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreTransactions = async () => {
    if (loadingMore || !hasMore || !selectedProperty?.id) return;
    
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      
      const { data: payData, error: payError } = await supabase
        .from("pg_transactions")
        .select(`*`)
        .eq("pg_id", selectedProperty.id)
        .order("created_at", { ascending: false })
        .range(nextPage * 5 - 5, nextPage * 5 - 1);
      
      if (!payError && payData) {
        const moreTx = payData.map((p: any) => {
          const isExpense = p.type === "Expense";
          return {
            id: p.id,
            title: p.title || (isExpense ? "Other Expense" : "Rent Payment"),
            date: new Date(p.created_at).toLocaleDateString(),
            time: new Date(p.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            amount: `${isExpense ? "- " : ""}₹${p.amount}`,
            status: isExpense ? "Expense" : (p.status === "Paid" ? "+ Paid" : p.status),
            color: isExpense ? "#FFCDD2" : (p.status === "Paid" ? "#CCFF00" : (p.status === "Unpaid" ? "#FFCDD2" : "#FFF9C4")),
            isPositive: !isExpense && p.status === "Paid",
            isExpense: isExpense
          };
        });
        
        setTransactions([...transactions, ...moreTx]);
        setHasMore(payData.length === 5);
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Load more error:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <View className="flex-1 bg-surface-bg" style={{ paddingTop: insets.top }}>
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View className="py-6 flex-row justify-between items-center mb-2">
          <View>
            <Text className="text-text-primary text-xl font-black mb-0.5 tracking-tight">
              {t("good_morning")}, {profile?.full_name?.split(" ")[0] ?? "Owner"}
            </Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate("PropertySelector")}
              activeOpacity={0.7}
              className="flex-row items-center"
            >
              <View className="bg-[#CCFF00] h-1.5 w-1.5 rounded-full mr-2" />
              <Text className="text-text-secondary text-sm font-bold mr-1">
                {selectedProperty?.name || t("select_property_label")}
              </Text>
              <ChevronRight size={14} color="#A1A1AA" strokeWidth={3} />
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity 
              onPress={() => navigation.navigate("TenantDetails")}
              className="h-10 w-10 bg-white rounded-full items-center justify-center border border-zinc-200 shadow-sm mr-2"
            >
              <UserPlus size={20} color="#1C1C1C" strokeWidth={2.5} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => navigation.navigate("Expenses")}
              className="h-10 w-10 bg-white rounded-full items-center justify-center border border-zinc-200 shadow-sm"
            >
              <Receipt size={18} color="#1C1C1C" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" color="#CCFF00" />
          </View>
        ) : (
          <>
            {/* Main Balance Cards */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8 overflow-visible px-1" contentContainerStyle={{ paddingRight: 20 }}>
              
              {/* Card 1: Total Collected */}
              <View className="bg-white rounded-[32px] p-6 border border-zinc-200 mr-4" style={{ width: width * 0.75, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-text-secondary text-base font-medium">{t("collected_rent")}</Text>
                  <Wallet size={20} color="#757575" strokeWidth={2} />
                </View>
                <Text className="text-text-primary font-black text-5xl tracking-tighter mb-8">
                  ₹{totalCollected.toLocaleString('en-IN')}
                </Text>
                <TouchableOpacity 
                  onPress={() => navigation.navigate("Tenants")}
                  className="bg-[#1C1C1C] rounded-full py-4 items-center justify-center active:opacity-80"
                >
                  <Text className="text-white font-bold text-lg">{t("add_payment")}</Text>
                </TouchableOpacity>
              </View>

              {/* Card 1.5: Total Expenses */}
              <View className="bg-white rounded-[32px] p-6 border border-zinc-200 mr-4" style={{ width: width * 0.75, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-text-secondary text-base font-medium">{t("total_expenses")}</Text>
                  <TrendingDown size={20} color="#FF3D00" strokeWidth={2} />
                </View>
                <Text className="text-[#FF3D00] font-black text-5xl tracking-tighter mb-8">
                  ₹{totalExpenses.toLocaleString('en-IN')}
                </Text>
                <TouchableOpacity 
                  onPress={() => navigation.navigate("Expenses")}
                  className="bg-zinc-100 rounded-full py-4 items-center justify-center active:opacity-80"
                >
                  <Text className="text-[#1C1C1C] font-bold text-lg">{t("manage_expenses")}</Text>
                </TouchableOpacity>
              </View>

              {/* Card 2: Total Tenants */}
              <View className="bg-white rounded-[32px] p-6 border border-zinc-200 mr-4" style={{ width: width * 0.75, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-text-secondary text-base font-medium">{t("occupancy")}</Text>
                  <Users size={20} color="#757575" strokeWidth={2} />
                </View>
                <Text className="text-text-primary font-black text-5xl tracking-tighter mb-8">
                  {totalTenants} <Text className="text-2xl text-text-secondary font-bold">/ {totalBeds} {t("beds_count")}</Text>
                </Text>
                <TouchableOpacity 
                  onPress={() => navigation.navigate("Tenants")}
                  className="bg-zinc-100 rounded-full py-4 items-center justify-center active:opacity-80"
                >
                  <Text className="text-[#1C1C1C] font-bold text-lg">{t("manage_tenants")}</Text>
                </TouchableOpacity>
              </View>

              {/* Card 3: Monthly Revenue */}
              <View className="bg-white rounded-[32px] p-6 border border-zinc-200 mr-4" style={{ width: width * 0.75, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-text-secondary text-base font-medium">{t("monthly_revenue")}</Text>
                  <TrendingUp size={20} color="#757575" strokeWidth={2} />
                </View>
                <Text className="text-[#00C853] font-black text-5xl tracking-tighter mb-8">
                  ₹{monthlyRevenue.toLocaleString('en-IN')}
                </Text>
                <TouchableOpacity className="bg-zinc-100 rounded-full py-4 items-center justify-center active:opacity-80">
                  <Text className="text-[#1C1C1C] font-bold text-lg">{t("view_reports")}</Text>
                </TouchableOpacity>
              </View>

              {/* Card 4: Pending Rent */}
              <View className="bg-white rounded-[32px] p-6 border border-zinc-200 mr-4" style={{ width: width * 0.75, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-text-secondary text-base font-medium">{t("pending_rent")}</Text>
                  <Clock size={20} color="#757575" strokeWidth={2} />
                </View>
                <Text className={`${pendingRent > 50000 ? 'text-[#FF3D00]' : 'text-[#FF9100]'} font-black text-5xl tracking-tighter mb-8`}>
                  ₹{pendingRent.toLocaleString('en-IN')}
                </Text>
                <TouchableOpacity className="bg-zinc-100 rounded-full py-4 items-center justify-center active:opacity-80">
                  <Text className="text-[#1C1C1C] font-bold text-lg">{t("send_reminders")}</Text>
                </TouchableOpacity>
              </View>

            </ScrollView>

            {/* Properties / Cards Section */}
            <View className="mb-8">
              <View className="flex-row justify-between items-center mb-4 px-1">
                <Text className="text-text-primary text-xl font-bold tracking-tight">{t("properties")}</Text>
                <TouchableOpacity 
                  onPress={() => navigation.navigate("PropertyDetails")}
                  className="flex-row items-center"
                >
                  <PlusCircle size={16} color="#1C1C1C" strokeWidth={2.5} />
                  <Text className="text-text-primary font-bold ml-1.5 text-sm">{t("new")}</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible">
                {pgs.length === 0 ? (
                  <View className="bg-white rounded-[32px] p-5 mr-4 items-center justify-center border border-zinc-200" style={{ width: width * 0.45, height: 175, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 }}>
                    <Text className="text-text-secondary font-bold text-sm text-center">{t("no_properties")}</Text>
                  </View>
                ) : (
                  pgs.map((pg, index) => (
                    <TouchableOpacity 
                      key={pg.id} 
                      onPress={() => setSelectedProperty(pg)}
                      activeOpacity={0.9}
                      className={`${index % 2 === 0 ? 'bg-[#CCFF00]' : 'bg-[#1C1C1C]'} rounded-[32px] p-5 mr-4`} 
                      style={{ width: width * 0.45, height: 175, overflow: 'hidden' }}
                    >
                      <Text className={`${index % 2 === 0 ? 'text-black/5' : 'text-white/5'} font-black text-6xl absolute -top-2 -left-2 tracking-tighter leading-none`}>
                        THOST
                      </Text>
                      <View className="flex-1 justify-between z-10">
                          <View className="flex-row justify-between items-start">
                            <Text className={`font-black text-2xl ${index % 2 === 0 ? 'text-black' : 'text-white'}`}>
                              {String.fromCharCode(65 + index)}.
                            </Text>
                            {index % 2 === 0 ? (
                              <Building2 size={24} color="#000" strokeWidth={2.5} />
                            ) : (
                              <Building size={24} color="#FFF" strokeWidth={2.5} />
                            )}
                          </View>
                          <View>
                            <View className="flex-row items-center justify-between mb-2">
                              <Text className={`${index % 2 === 0 ? 'text-black/60' : 'text-white/60'} font-semibold text-xs uppercase tracking-widest`}>PG Building</Text>
                              {selectedProperty?.id === pg.id && (
                                <View className={`${index % 2 === 0 ? 'bg-black/10' : 'bg-white/10'} px-2 py-0.5 rounded-full flex-row items-center`}>
                                  <Check size={10} color={index % 2 === 0 ? "#000" : "#FFF"} strokeWidth={3} />
                                  <Text className={`${index % 2 === 0 ? 'text-black' : 'text-white'} text-[8px] font-black ml-1 uppercase`}>{t("selected")}</Text>
                                </View>
                              )}
                            </View>
                            <Text className={`${index % 2 === 0 ? 'text-black' : 'text-white'} font-black text-xl mb-2`} numberOfLines={1}>{pg.name}</Text>
                            <View className={`${index % 2 === 0 ? 'bg-white' : 'bg-white/10'} rounded-full px-4 py-2 self-start flex-row items-center shadow-sm`}>
                              <Text className={`${index % 2 === 0 ? 'text-black' : 'text-white'} font-bold text-[10px] uppercase tracking-widest`}>
                                {pg.total_beds} {t("beds_count")}
                              </Text>
                            </View>
                          </View>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </View>

            {/* Transactions / Recent Updates */}
            <View className="mb-10">
              <View className="flex-row justify-between items-center mb-4 px-1">
                <Text className="text-text-primary text-xl font-bold tracking-tight">{t("payments_title")}</Text>
              </View>
              
              <View className="bg-white rounded-[32px] p-3 border border-zinc-200" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 }}>
                {transactions.length === 0 ? (
                  <View className="p-4 items-center">
                    <Text className="text-text-secondary font-bold text-sm">{t("no_transactions")}</Text>
                  </View>
                ) : (
                  transactions.map((tx, idx) => (
                    <View key={tx.id} className={`p-4 flex-row items-center ${idx !== transactions.length - 1 ? 'border-b border-zinc-50' : ''}`}>
                      <View className="h-12 w-12 rounded-full items-center justify-center mr-4 border border-zinc-100 bg-surface-bg">
                        {tx.isExpense ? (
                          <Receipt size={20} color="#FF3D00" strokeWidth={2} />
                        ) : (
                          <Zap size={20} color="#1C1C1C" strokeWidth={2} />
                        )}
                      </View>
                      <View className="flex-1">
                        <Text className="text-text-primary text-base font-bold mb-0.5">{tx.title}</Text>
                        <Text className="text-text-secondary text-xs font-medium">{tx.date} • {tx.time}</Text>
                      </View>
                      <View className="items-end">
                        <Text className="text-text-primary font-black text-base">{tx.amount}</Text>
                        <View style={{ backgroundColor: tx.color }} className="px-2 py-0.5 rounded mt-1">
                          <Text className="text-black text-[10px] font-bold uppercase">{tx.status}</Text>
                        </View>
                      </View>
                    </View>
                  ))
                )}

                {hasMore && transactions.length > 0 && (
                  <TouchableOpacity 
                    onPress={fetchMoreTransactions}
                    disabled={loadingMore}
                    className="py-4 items-center border-t border-zinc-50"
                  >
                    {loadingMore ? (
                      <ActivityIndicator size="small" color="#1C1C1C" />
                    ) : (
                      <Text className="text-text-primary font-bold text-sm">{t("load_more")}</Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </>
        )}
        
        <View style={{ height: insets.bottom + 80 }} />
      </ScrollView>

      {/* AI Hover Button (FAB) */}
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={() => Alert.alert("AI PG Analysis", "Analyzing PG data, occupancy rates, and pending dues with AI...")}
        className="absolute bottom-6 right-5 bg-[#1C1C1C] flex-row items-center justify-center px-5 py-4 rounded-full shadow-lg"
        style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 8 }}
      >
        <Sparkles size={20} color="#CCFF00" strokeWidth={2.5} />
        <Text className="text-white font-black ml-2 tracking-wide text-[15px]">{t("ask_ai")}</Text>
      </TouchableOpacity>
    </View>
  );
}
