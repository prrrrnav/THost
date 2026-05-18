import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { User, FileText, TrendingUp, Zap } from "@/lib/icons";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useFocusEffect } from "@react-navigation/native";

function TransactionItem({ name, room, amount, tag, isLast }: { name: string; room: string; amount: string; tag: string; isLast?: boolean }) {
  return (
    <TouchableOpacity activeOpacity={0.7} className={`flex-row items-center py-4 px-4 ${!isLast ? 'border-b border-zinc-50' : ''}`}>
      <View className="h-12 w-12 bg-surface-bg rounded-full items-center justify-center mr-4 border border-zinc-200">
        <User size={20} color="#1C1C1C" strokeWidth={2} />
      </View>
      <View className="flex-1">
        <Text className="text-text-primary text-base font-bold">{name}</Text>
        <Text className="text-text-secondary text-xs font-medium mt-0.5">{room}</Text>
      </View>
      <View className="items-end">
        <Text className="text-text-primary text-base font-black">+{amount}</Text>
        <View className="bg-[#CCFF00] px-2 py-0.5 rounded-md mt-1">
           <Text className="text-black text-[10px] font-black uppercase tracking-widest">{tag}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function PaymentsScreen() {
  const insets = useSafeAreaInsets();
  const { selectedProperty } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [collectedAmount, setCollectedAmount] = useState(0);
  const [totalExpected, setTotalExpected] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [totalTenantsCount, setTotalTenantsCount] = useState(0);
  const [pendingTenants, setPendingTenants] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [showFinanceModal, setShowFinanceModal] = useState(false);
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);
  const [allTenants, setAllTenants] = useState<any[]>([]);
  const [selectedTenantForStatus, setSelectedTenantForStatus] = useState<any>(null);

  useFocusEffect(
    React.useCallback(() => {
      fetchPaymentsData();
    }, [selectedProperty?.id])
  );

  const fetchPaymentsData = async () => {
    if (!selectedProperty?.id) return;
    
    try {
      setLoading(true);
      
      // Fetch Tenants to calculate Collected and Pending
      const { data: tenantsData } = await supabase
        .from("tenants")
        .select("*")
        .eq("pg_id", selectedProperty.id);

      let collected = 0;
      let expected = 0;
      let pendingList: any[] = [];
      let pendingSum = 0;

      if (tenantsData) {
        setAllTenants(tenantsData);
        setTotalTenantsCount(tenantsData.length);
        tenantsData.forEach(t => {
          const rent = Number(t.rent_amount || 0);
          expected += rent;
          if (t.status === "Paid") {
            collected += rent;
          } else if (t.status === "Pending" || t.status === "Due" || t.status === "Unpaid") {
            pendingList.push(t);
            pendingSum += rent;
          }
        });
      }

      setCollectedAmount(collected);
      setTotalExpected(expected);
      setPendingAmount(pendingSum);
      setPendingTenants(pendingList);

      // Fetch Recent Transactions from pg_transactions
      const { data: txData } = await supabase
        .from("pg_transactions")
        .select("*")
        .eq("pg_id", selectedProperty.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (txData) {
        setRecentTransactions(txData);
      }
    } catch (err) {
      console.error("Error fetching payments data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedTenantForStatus || !selectedProperty?.id) return;
    
    try {
      setLoading(true);
      const tenant = selectedTenantForStatus;
      setSelectedTenantForStatus(null);
      
      // Update tenant
      await supabase.from("tenants").update({ status }).eq("id", tenant.id);
      
      // Create transaction log
      await supabase.from("pg_transactions").insert({
        pg_id: selectedProperty.id,
        tenant_id: tenant.id,
        title: `${tenant.name} - Rent ${status}`,
        amount: tenant.rent_amount,
        type: status === "Paid" ? "Income" : "Pending",
        status: status
      });

      // --- SYNC WITH PAYMENTS TABLE ---
      try {
        const currentDate = new Date();
        const currentMonthStr = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        const paymentDateStr = currentDate.toISOString().split('T')[0];
        const rentVal = Number(tenant.rent_amount || 0);

        const paymentRecord = {
          tenant_id: tenant.id,
          tenant_email: tenant.email || "",
          month: currentMonthStr,
          month_year: currentMonthStr,
          amount: rentVal,
          status: status,
          due_date: new Date(currentDate.getFullYear(), currentDate.getMonth(), Number(tenant.due_date) || 5).toISOString().split('T')[0],
          amount_paid: status === "Paid" ? rentVal : 0,
          payment_date: status === "Paid" ? paymentDateStr : null
        };

        const { data: existingPayment } = await supabase
          .from("payments")
          .select("id")
          .eq("tenant_id", tenant.id)
          .eq("month", currentMonthStr)
          .maybeSingle();

        if (existingPayment) {
          await supabase
            .from("payments")
            .update(paymentRecord)
            .eq("id", existingPayment.id);
        } else {
          await supabase
            .from("payments")
            .insert([paymentRecord]);
        }
      } catch (syncErr) {
        console.error("Failed to sync payment record:", syncErr);
      }

      // Refresh data
      await fetchPaymentsData();
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-surface-bg" style={{ paddingTop: insets.top }}>
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View className="flex-row justify-between items-center py-6 mb-2">
          <View>
            <Text className="text-text-primary text-2xl font-black tracking-tight">Payments</Text>
            <Text className="text-text-secondary text-sm font-medium mt-1">Track your income</Text>
          </View>
          <TouchableOpacity 
            onPress={() => setShowFinanceModal(true)}
            className="h-12 w-12 bg-white rounded-2xl items-center justify-center border border-zinc-200"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 }}
          >
            <FileText size={20} color="#1C1C1C" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Main Collection Card (Matches "Your balance" card) */}
        <View className="bg-white rounded-[32px] p-6 mb-8 border border-zinc-200" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 }}>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-text-secondary text-sm font-bold">Collected this month</Text>
            <TrendingUp size={20} color="#A1A1AA" strokeWidth={2.5} />
          </View>
          <Text className="text-text-primary text-[40px] font-black tracking-tighter mb-6">₹{collectedAmount.toLocaleString('en-IN')}</Text>
          
          <TouchableOpacity 
            onPress={() => setShowRecordPaymentModal(true)}
            className="bg-[#1C1C1C] rounded-full py-4 items-center justify-center flex-row shadow-sm"
          >
            <Text className="text-white text-base font-bold">Record Payment</Text>
          </TouchableOpacity>
        </View>

        {/* Pending Dues Section (Matches horizontal scroll cards) */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4 px-1">
            <Text className="text-text-primary text-xl font-bold tracking-tight">Pending Dues</Text>
            <TouchableOpacity>
              <Text className="text-text-primary font-bold text-sm">Remind All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible">
            {pendingTenants.length === 0 ? (
              <View className="bg-white rounded-[24px] p-5 mr-4 justify-center items-center border border-zinc-200" style={{ width: 150, height: 140, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 }}>
                 <Text className="text-text-secondary font-bold text-center text-sm">No pending dues!</Text>
              </View>
            ) : (
              pendingTenants.map((t, index) => (
                <TouchableOpacity 
                  key={t.id} 
                  onPress={() => setSelectedTenantForStatus(t)}
                  activeOpacity={0.7}
                  className="bg-white border border-zinc-200 rounded-[24px] p-5 mr-4 justify-between" 
                  style={{ width: 150, height: 140, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 }}
                >
                   <View>
                     <Text className="text-text-secondary font-bold text-xs mb-1 uppercase tracking-widest">Room {t.room_number || 'N/A'}</Text>
                     <Text className="text-text-primary font-black text-xl leading-tight" numberOfLines={1}>{t.name}</Text>
                   </View>
                   <Text className="text-text-primary font-black text-2xl tracking-tighter">₹{t.rent_amount?.toLocaleString('en-IN') || 0}</Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>

        {/* Recent History Section (Matches Transactions list) */}
        <View className="mb-10">
          <View className="flex-row justify-between items-center mb-4 px-1">
            <Text className="text-text-primary text-xl font-bold tracking-tight">Recent History</Text>
            <TouchableOpacity>
              <Text className="text-text-primary font-bold text-sm">See all</Text>
            </TouchableOpacity>
          </View>
          
          <View className="bg-white rounded-[32px] p-2 border border-zinc-200" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 }}>
            {recentTransactions.length === 0 ? (
              <View className="p-8 items-center">
                <Text className="text-text-secondary font-bold text-sm">No recent transactions</Text>
              </View>
            ) : (
              recentTransactions.map((tx, idx) => (
                <TransactionItem 
                  key={tx.id}
                  name={tx.title} 
                  room={`${new Date(tx.created_at).toLocaleDateString()} • ${new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`} 
                  amount={tx.amount} 
                  tag={tx.status} 
                  isLast={idx === recentTransactions.length - 1}
                />
              ))
            )}
          </View>
        </View>

        <View style={{ height: insets.bottom + 20 }} />
      </ScrollView>

      {/* Finance Details Modal */}
      <Modal
        visible={showFinanceModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFinanceModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <Pressable className="flex-1" onPress={() => setShowFinanceModal(false)} />
          <View className="bg-white rounded-t-[32px] p-6 pb-12 shadow-lg" style={{ paddingBottom: insets.bottom + 20 }}>
            <View className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto mb-6" />
            
            <View className="flex-row items-center mb-6">
              <View className="h-12 w-12 bg-[#CCFF00] rounded-2xl items-center justify-center mr-4">
                <FileText size={24} color="#1C1C1C" strokeWidth={2.5} />
              </View>
              <View>
                <Text className="text-text-primary text-2xl font-black">Finance Summary</Text>
                <Text className="text-text-secondary text-sm font-medium">{selectedProperty?.name || "All Properties"}</Text>
              </View>
            </View>

            <View className="bg-surface-bg rounded-3xl p-5 border border-zinc-200 mb-6">
              <View className="flex-row justify-between mb-4 pb-4 border-b border-zinc-200">
                <Text className="text-text-secondary font-bold">Total Occupancy</Text>
                <Text className="text-text-primary font-black">{totalTenantsCount} Tenants</Text>
              </View>
              <View className="flex-row justify-between mb-4 pb-4 border-b border-zinc-200">
                <Text className="text-text-secondary font-bold">Expected Revenue</Text>
                <Text className="text-text-primary font-black">₹{totalExpected.toLocaleString('en-IN')}</Text>
              </View>
              <View className="flex-row justify-between mb-4 pb-4 border-b border-zinc-200">
                <Text className="text-text-secondary font-bold">Collected Amount</Text>
                <Text className="text-[#84CC16] font-black">₹{collectedAmount.toLocaleString('en-IN')}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-text-secondary font-bold">Pending Dues</Text>
                <Text className="text-[#EF4444] font-black">₹{pendingAmount.toLocaleString('en-IN')}</Text>
              </View>
            </View>

            <TouchableOpacity 
              onPress={() => setShowFinanceModal(false)}
              className="bg-[#1C1C1C] rounded-full py-4 items-center justify-center shadow-sm"
            >
              <Text className="text-white text-base font-bold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Record Payment Modal (Tenant List) */}
      <Modal
        visible={showRecordPaymentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRecordPaymentModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <Pressable className="flex-1" onPress={() => setShowRecordPaymentModal(false)} />
          <View className="bg-white rounded-t-[32px] p-6 pb-12 shadow-lg h-[80%]" style={{ paddingBottom: insets.bottom + 20 }}>
            <View className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto mb-6" />
            
            <View className="flex-row items-center mb-6 justify-between">
              <View>
                <Text className="text-text-primary text-2xl font-black">Record Payment</Text>
                <Text className="text-text-secondary text-sm font-medium">Select a tenant to update status</Text>
              </View>
              <TouchableOpacity onPress={() => setShowRecordPaymentModal(false)} className="h-10 w-10 bg-zinc-100 rounded-full items-center justify-center">
                <Text className="text-xl text-zinc-500 font-bold">×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              {allTenants.map((t, index) => (
                <TouchableOpacity 
                  key={t.id}
                  onPress={() => setSelectedTenantForStatus(t)}
                  activeOpacity={0.7} 
                  className={`flex-row items-center py-4 px-2 ${index !== allTenants.length - 1 ? 'border-b border-zinc-100' : ''}`}
                >
                  <View className="h-10 w-10 bg-surface-bg rounded-full items-center justify-center mr-4 border border-zinc-200">
                    <User size={18} color="#1C1C1C" strokeWidth={2} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-text-primary text-base font-bold">{t.name}</Text>
                    <Text className="text-text-secondary text-xs font-medium mt-0.5">Room {t.room_number || 'N/A'} • ₹{t.rent_amount?.toLocaleString()}</Text>
                  </View>
                  <View className={`px-2 py-1 rounded-md ${t.status === 'Paid' ? 'bg-[#CCFF00]' : 'bg-zinc-100'}`}>
                    <Text className={`text-[10px] font-black uppercase tracking-widest ${t.status === 'Paid' ? 'text-black' : 'text-zinc-500'}`}>{t.status || 'Due'}</Text>
                  </View>
                </TouchableOpacity>
              ))}
              {allTenants.length === 0 && (
                <Text className="text-center text-text-secondary mt-10 font-bold">No tenants found.</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Status Selection Modal */}
      <Modal
        visible={!!selectedTenantForStatus}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedTenantForStatus(null)}
      >
        <View className="flex-1 bg-black/60 items-center justify-center p-5">
          <View className="bg-white rounded-[32px] w-full p-6 shadow-xl">
            <Text className="text-text-primary text-xl font-black mb-1">Update Status</Text>
            <Text className="text-text-secondary text-sm font-medium mb-6">
              Mark rent for {selectedTenantForStatus?.name} (Room {selectedTenantForStatus?.room_number})
            </Text>
            
            <View className="flex-row justify-between mb-4">
              <TouchableOpacity onPress={() => handleUpdateStatus('Paid')} className="flex-1 bg-[#CCFF00] py-4 rounded-2xl items-center mr-2">
                <Text className="text-black font-black text-base">Paid</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleUpdateStatus('Due')} className="flex-1 bg-zinc-100 py-4 rounded-2xl items-center mx-1">
                <Text className="text-zinc-600 font-black text-base">Due</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleUpdateStatus('Unpaid')} className="flex-1 bg-[#EF4444] py-4 rounded-2xl items-center ml-2">
                <Text className="text-white font-black text-base">Unpaid</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity onPress={() => setSelectedTenantForStatus(null)} className="py-4 items-center mt-2">
              <Text className="text-text-secondary font-bold text-base">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
