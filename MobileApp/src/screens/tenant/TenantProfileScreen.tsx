// src/screens/tenant/TenantProfileScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, RefreshControl
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { 
  User, LogOut
} from "@/lib/icons";

export default function TenantProfileScreen() {
  const { session, profile, signOut } = useAuth();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [tenantData, setTenantData] = useState<any>(null);
  const [pgDetails, setPgDetails] = useState<any>(null);

  const fetchProfileDetails = async () => {
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
        }
      }
    } catch (e) {
      console.warn("Error fetching profile details:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfileDetails();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfileDetails();
  };

  if (loading) {
    return (
      <View className="flex-1 bg-[#FCFCFC] items-center justify-center">
        <ActivityIndicator size="large" color="#1C1C1C" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#FCFCFC]" style={{ paddingTop: insets.top }}>
      
      {/* Airbnb-Style Header */}
      <View className="px-6 pt-6 pb-4 bg-white border-b border-zinc-100">
        <Text className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
          Profile Settings
        </Text>
        <Text className="text-[#1C1C1C] text-2xl font-black tracking-tight mt-0.5">
          Account details
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1C1C1C" />
        }
      >
        <View className="px-5 pt-6">
          
          {/* User Profile Overview in Airbnb Style */}
          <View 
            className="bg-white p-6 rounded-[32px] border border-zinc-200/80 shadow-sm mb-6 items-center"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 }}
          >
            <View className="bg-zinc-100 p-5 rounded-full mb-3 border border-zinc-200">
              <User size={38} color="#1C1C1C" strokeWidth={1.5} />
            </View>
            <Text className="text-[#1C1C1C] text-xl font-black tracking-tight">
              {tenantData?.name || "Verified Resident"}
            </Text>
            
            <View className="mt-2.5 px-3.5 py-1 bg-[#CCFF00]/10 border border-[#CCFF00]/30 rounded-full">
              <Text className="text-black text-[9px] font-black uppercase tracking-wider">
                Room {tenantData?.room_number || "Unassigned"}
              </Text>
            </View>
          </View>

          {/* Section: Personal Information */}
          <Text className="text-[#1C1C1C] text-[15px] font-black tracking-tight mb-3 px-1">
            Personal details
          </Text>

          <View 
            className="bg-white p-6 rounded-[32px] border border-zinc-200/80 shadow-sm mb-6"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 }}
          >
            <View className="mb-4">
              <Text className="text-zinc-400 text-[9px] font-black uppercase tracking-wider">Email Address</Text>
              <Text className="text-[#1C1C1C] text-xs font-bold mt-1">{session?.user?.email || "Not Configured"}</Text>
            </View>

            <View className="mb-4">
              <Text className="text-zinc-400 text-[9px] font-black uppercase tracking-wider">Phone Number</Text>
              <Text className="text-[#1C1C1C] text-xs font-bold mt-1">{tenantData?.phone || "Not Configured"}</Text>
            </View>

            <View>
              <Text className="text-zinc-400 text-[9px] font-black uppercase tracking-wider">Verified ID Status</Text>
              <Text className="text-[#1C1C1C] text-xs font-bold mt-1 uppercase tracking-widest text-green-600">ID VERIFIED</Text>
            </View>
          </View>

          {/* Section: Residence Details */}
          <Text className="text-[#1C1C1C] text-[15px] font-black tracking-tight mb-3 px-1">
            PG stay information
          </Text>

          <View 
            className="bg-white p-6 rounded-[32px] border border-zinc-200/80 shadow-sm mb-8"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 }}
          >
            <View className="mb-4">
              <Text className="text-zinc-400 text-[9px] font-black uppercase tracking-wider">PG Residence Name</Text>
              <Text className="text-[#1C1C1C] text-xs font-bold mt-1">{pgDetails?.name || "Not connected to a PG"}</Text>
            </View>

            <View className="mb-4">
              <Text className="text-zinc-400 text-[9px] font-black uppercase tracking-wider">Property Address</Text>
              <Text className="text-[#1C1C1C] text-xs font-bold mt-1 leading-4">{pgDetails?.address || "N/A"}</Text>
            </View>

            <View>
              <Text className="text-zinc-400 text-[9px] font-black uppercase tracking-wider">PG Invite Code</Text>
              <View className="flex-row items-center mt-1.5">
                <View className="bg-[#CCFF00] px-3.5 py-1.5 rounded-full border border-black/10">
                  <Text className="text-black text-[10px] font-black uppercase tracking-widest">
                    {pgDetails?.joining_code || "N/A"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Airbnb Signature Red/Pink themed sleek Sign Out Button */}
          <TouchableOpacity
            onPress={() => signOut()}
            className="bg-[#FF5A5F] h-14 rounded-full items-center justify-center flex-row active:opacity-90 shadow-lg"
            style={{ shadowColor: '#FF5A5F', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 4 }}
          >
            <LogOut size={16} color="#FFFFFF" style={{ marginRight: 6 }} strokeWidth={2.5} />
            <Text className="text-white text-xs font-black uppercase tracking-wider">Logout Profile</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
}
