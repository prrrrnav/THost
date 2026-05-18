// src/screens/tenant/TenantHomeScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, RefreshControl
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { 
  Home, Megaphone, ReceiptText, Calendar, Wallet, Clock, Sparkles
} from "@/lib/icons";

export default function TenantHomeScreen() {
  const { session, profile } = useAuth();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [tenantData, setTenantData] = useState<any>(null);
  const [pgDetails, setPgDetails] = useState<any>(null);
  const [notices, setNotices] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [showWeeklyMenu, setShowWeeklyMenu] = useState(false);

  const currentMonthName = new Date().toLocaleString("en-US", { month: "long" });
  const userEmail = session?.user?.email || profile?.email;

  const fetchHomeData = async () => {
    try {
      const userId = session?.user?.id;
      if (!userId) return;

      const { data: tenant, error: tenantError } = await supabase
        .from("tenants")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (tenantError) throw tenantError;

      if (tenant) {
        setTenantData(tenant);

        if (tenant.pg_id) {
          const { data: pg, error: pgError } = await supabase
            .from("pg_details")
            .select("*")
            .eq("id", tenant.pg_id)
            .maybeSingle();

          if (pgError) throw pgError;
          setPgDetails(pg);

          const { data: payHistory, error: payError } = await supabase
            .from("payments")
            .select("*")
            .eq("tenant_id", tenant.id)
            .eq("status", "Paid")
            .order("payment_date", { ascending: false })
            .limit(5);

          if (payError) throw payError;
          setPayments(payHistory || []);

          const { data: noticesList, error: noticesError } = await supabase
            .from("notifications")
            .select("*")
            .eq("pg_id", tenant.pg_id)
            .or(`target_tenant_email.is.null,target_tenant_email.eq.${userEmail}`)
            .order("created_at", { ascending: false });

          if (noticesError) throw noticesError;
          setNotices(noticesList || []);

          const { data: menuList, error: menuError } = await supabase
            .from("menu_items")
            .select("*")
            .eq("pg_id", tenant.pg_id);

          if (menuError) throw menuError;
          setMenuItems(menuList || []);
        }
      }
    } catch (e) {
      console.warn("Error loading resident home screen:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHomeData();
  };

  const getTodayMenu = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = days[new Date().getDay()];
    
    const todayItems = menuItems.filter(
      item => item.day_of_week?.toLowerCase() === today.toLowerCase()
    );

    const menuObj = { breakfast: "Not Configured", lunch: "Not Configured", dinner: "Not Configured" };
    todayItems.forEach(item => {
      const type = item.meal_type?.toLowerCase();
      if (type === "breakfast") menuObj.breakfast = item.dishes;
      if (type === "lunch") menuObj.lunch = item.dishes;
      if (type === "dinner") menuObj.dinner = item.dishes;
    });
    return menuObj;
  };

  if (loading) {
    return (
      <View className="flex-1 bg-[#FCFCFC] items-center justify-center">
        <ActivityIndicator size="large" color="#1C1C1C" />
      </View>
    );
  }

  const isPaid = tenantData?.status === "Paid";
  const rentAmount = tenantData?.rent_amount || 0;
  const outstanding = tenantData?.outstanding_amount || 0;
  const todayMenu = getTodayMenu();

  return (
    <View className="flex-1 bg-[#FCFCFC]" style={{ paddingTop: insets.top }}>
      
      {/* Sleek Airbnb-Style Header */}
      <View className="px-6 pt-6 pb-4 bg-white border-b border-zinc-100 flex-row justify-between items-center">
        <View>
          <Text className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
            {pgDetails?.name || "Verified Stay"}
          </Text>
          <Text className="text-[#1C1C1C] text-2xl font-black tracking-tight mt-0.5">
            Hey, {tenantData?.name || "Resident"}
          </Text>
        </View>

        {/* Room pill in Airbnb Highlight Style */}
        <View className="bg-[#1C1C1C] px-3.5 py-1.5 rounded-full">
          <Text className="text-[#CCFF00] text-[10px] font-black uppercase tracking-wider">
            Room {tenantData?.room_number || "Unassigned"}
          </Text>
        </View>
      </View>

      {/* Main Workspace Scroll */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1C1C1C" />
        }
      >
        <View className="px-5 pt-6">
          
          {/* Section: Your Stay & Dues */}
          <Text className="text-[#1C1C1C] text-[15px] font-black tracking-tight mb-3 px-1">
            Your stay & dues
          </Text>
          
          <View 
            className="bg-white rounded-[32px] border border-zinc-200/80 p-6 mb-6 shadow-sm"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 }}
          >
            {/* Rent and Outstanding Row */}
            <View className="flex-row justify-between items-start mb-6">
              <View className="flex-1">
                <Text className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                  Monthly Rent
                </Text>
                <Text className="text-[#1C1C1C] text-3xl font-black tracking-tighter mt-1">
                  ₹{rentAmount.toLocaleString('en-IN')}
                </Text>
                
                <View 
                  className="mt-3 px-3 py-1.5 rounded-full items-center justify-center self-start border"
                  style={{
                    backgroundColor: isPaid ? "rgba(34, 197, 94, 0.06)" : "rgba(255, 61, 0, 0.06)",
                    borderColor: isPaid ? "rgba(34, 197, 94, 0.12)" : "rgba(255, 61, 0, 0.12)"
                  }}
                >
                  <Text 
                    className="text-[9px] font-black uppercase tracking-wider"
                    style={{ color: isPaid ? "#22C55E" : "#FF3D00" }}
                  >
                    {isPaid ? `Paid for ${currentMonthName}` : "Pending Rent"}
                  </Text>
                </View>
              </View>

              <View className="w-[1px] h-16 bg-zinc-100 mx-4" />

              <View className="flex-1">
                <Text className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                  Outstanding
                </Text>
                <Text className="text-[#FF3D00] text-3xl font-black tracking-tighter mt-1">
                  ₹{outstanding.toLocaleString('en-IN')}
                </Text>
                
                <Text className="text-zinc-500 text-[9px] font-bold mt-4 uppercase tracking-wider">
                  Due on: <Text className="text-[#1C1C1C] font-black">{tenantData?.due_date || 1}st monthly</Text>
                </Text>
              </View>
            </View>

            {/* Quick Action Button matching Owner style */}
            <TouchableOpacity 
              activeOpacity={0.8}
              className="bg-[#1C1C1C] rounded-full py-4 items-center justify-center flex-row shadow-sm active:opacity-90"
            >
              <Wallet size={16} color="#CCFF00" style={{ marginRight: 6 }} strokeWidth={2.5} />
              <Text className="text-white font-bold text-sm uppercase tracking-wider">
                {isPaid ? "View Rent Receipt" : "Quick Pay Dues"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Section: Today's Menu Experiences */}
          <View className="flex-row items-center justify-between mb-3 px-1">
            <Text className="text-[#1C1C1C] text-[15px] font-black tracking-tight">
              What's on the menu today
            </Text>
            
            <TouchableOpacity 
              onPress={() => setShowWeeklyMenu(!showWeeklyMenu)}
              className="bg-zinc-100 px-3 py-1.5 rounded-full active:opacity-75"
            >
              <Text className="text-[#1C1C1C] text-[10px] font-black uppercase tracking-wider">
                {showWeeklyMenu ? "Hide Weekly" : "View Weekly"}
              </Text>
            </TouchableOpacity>
          </View>

          <View 
            className="bg-white rounded-[32px] border border-zinc-200/80 p-5 mb-6 shadow-sm"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 }}
          >
            {/* Breakfast Card */}
            <View className="flex-row items-center p-3 mb-3 bg-zinc-50 rounded-2xl border border-zinc-100">
              <View className="h-10 w-10 bg-amber-500/10 rounded-full items-center justify-center mr-3">
                <Text className="text-lg">🍳</Text>
              </View>
              <View className="flex-1">
                <Text className="text-[#1C1C1C] text-[10px] font-black uppercase tracking-wider">Breakfast</Text>
                <Text className="text-zinc-600 text-xs font-bold mt-0.5">{todayMenu.breakfast}</Text>
              </View>
            </View>

            {/* Lunch Card */}
            <View className="flex-row items-center p-3 mb-3 bg-zinc-50 rounded-2xl border border-zinc-100">
              <View className="h-10 w-10 bg-green-500/10 rounded-full items-center justify-center mr-3">
                <Text className="text-lg">🍲</Text>
              </View>
              <View className="flex-1">
                <Text className="text-[#1C1C1C] text-[10px] font-black uppercase tracking-wider">Lunch</Text>
                <Text className="text-zinc-600 text-xs font-bold mt-0.5">{todayMenu.lunch}</Text>
              </View>
            </View>

            {/* Dinner Card */}
            <View className="flex-row items-center p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
              <View className="h-10 w-10 bg-indigo-500/10 rounded-full items-center justify-center mr-3">
                <Text className="text-lg">🍛</Text>
              </View>
              <View className="flex-1">
                <Text className="text-[#1C1C1C] text-[10px] font-black uppercase tracking-wider">Dinner</Text>
                <Text className="text-zinc-600 text-xs font-bold mt-0.5">{todayMenu.dinner}</Text>
              </View>
            </View>

            {showWeeklyMenu && (
              <View className="border-t border-zinc-100 mt-5 pt-4">
                <Text className="text-[#1C1C1C] text-xs font-black uppercase tracking-widest mb-3">
                  Weekly Meals Schedule
                </Text>
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => {
                  const dayItems = menuItems.filter(item => item.day_of_week?.toLowerCase() === day.toLowerCase());
                  return (
                    <View key={day} className="mb-3 bg-zinc-50 p-3.5 rounded-2xl border border-zinc-100">
                      <Text className="text-[#1C1C1C] text-xs font-black mb-1.5">{day}</Text>
                      <Text className="text-zinc-500 text-[10px] font-semibold leading-4">
                        🍳 <Text className="font-black text-[#1C1C1C]">Breakfast:</Text> {dayItems.find(i=>i.meal_type?.toLowerCase()==="breakfast")?.dishes || "Not Configured"}{"\n"}
                        🍲 <Text className="font-black text-[#1C1C1C]">Lunch:</Text> {dayItems.find(i=>i.meal_type?.toLowerCase()==="lunch")?.dishes || "Not Configured"}{"\n"}
                        🍛 <Text className="font-black text-[#1C1C1C]">Dinner:</Text> {dayItems.find(i=>i.meal_type?.toLowerCase()==="dinner")?.dishes || "Not Configured"}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          {/* Section: Announcements from your Host */}
          <Text className="text-[#1C1C1C] text-[15px] font-black tracking-tight mb-3 px-1">
            Announcements from your Host
          </Text>

          <View 
            className="bg-white rounded-[32px] border border-zinc-200/80 p-5 mb-6 shadow-sm"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 }}
          >
            {notices.length > 0 ? (
              notices.map((notice, idx) => (
                <View 
                  key={notice.id || idx}
                  className={`pb-4 mb-4 ${idx !== notices.length - 1 ? 'border-b border-zinc-100' : ''}`}
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-[#1C1C1C] text-xs font-black tracking-tight">
                      {notice.title}
                    </Text>
                    
                    {/* Active highlight color badge */}
                    <View className="bg-[#CCFF00] px-2 py-0.5 rounded-full border border-black/10">
                      <Text className="text-black text-[8px] font-black uppercase">
                        {notice.type || "ALERT"}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-zinc-500 text-xs mt-1.5 leading-5 font-semibold">
                    {notice.message}
                  </Text>
                  <Text className="text-zinc-400 text-[8px] mt-2 font-bold uppercase tracking-wider">
                    Posted: {notice.created_at ? new Date(notice.created_at).toLocaleDateString() : ""}
                  </Text>
                </View>
              ))
            ) : (
              <View className="items-center py-6">
                <Text className="text-zinc-400 text-xs font-semibold">No announcements active from host.</Text>
              </View>
            )}
          </View>

          {/* Section: Payments History */}
          <Text className="text-[#1C1C1C] text-[15px] font-black tracking-tight mb-3 px-1">
            Recent payments log
          </Text>

          <View 
            className="bg-white rounded-[32px] border border-zinc-200/80 p-5 shadow-sm"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 }}
          >
            {payments.length > 0 ? (
              payments.map((item, idx) => (
                <View 
                  key={item.id || idx} 
                  className={`flex-row justify-between items-center py-3.5 ${idx !== payments.length - 1 ? 'border-b border-zinc-50' : ''}`}
                >
                  <View className="flex-row items-center">
                    <View className="h-10 w-10 bg-[#CCFF00]/10 rounded-full border border-[#CCFF00]/30 items-center justify-center mr-3">
                      <ReceiptText size={18} color="#1C1C1C" strokeWidth={2} />
                    </View>
                    <View>
                      <Text className="text-[#1C1C1C] text-xs font-black">
                        Rent Payment
                      </Text>
                      <Text className="text-zinc-400 text-[9px] font-semibold mt-0.5">
                        {item.payment_date || item.created_at ? new Date(item.payment_date || item.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : ""}
                      </Text>
                    </View>
                  </View>
                  
                  <View className="items-end">
                    <Text className="text-[#1C1C1C] text-xs font-black">
                      +₹{item.amount}
                    </Text>
                    <View className="bg-[#CCFF00] px-2 py-0.5 rounded border border-black/10 mt-1">
                      <Text className="text-black text-[8px] font-black uppercase">
                        SUCCESS
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View className="items-center py-6">
                <Text className="text-zinc-400 text-xs font-semibold">No payments logged.</Text>
              </View>
            )}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}
