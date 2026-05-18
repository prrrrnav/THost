// src/screens/admin/ApprovalsScreen.tsx
import React, { useState, useEffect } from "react";
import { 
  View, Text, ScrollView, TouchableOpacity, 
  ActivityIndicator, Alert, RefreshControl, Modal, TextInput, KeyboardAvoidingView, Platform 
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/context/LocalizationContext";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Users, Check, X, Phone, Mail, Calendar, Sparkles } from "@/lib/icons";

export default function ApprovalsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { selectedProperty } = useAuth();
  const { t } = useTranslation();

  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Approval modal states
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [roomNumber, setRoomNumber] = useState("");
  const [rentAmount, setRentAmount] = useState("10000");
  const [dueDate, setDueDate] = useState("5");

  useEffect(() => {
    fetchJoinRequests();
  }, [selectedProperty]);

  const fetchJoinRequests = async () => {
    if (!selectedProperty?.id) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("join_requests")
        .select("*")
        .eq("pg_id", selectedProperty.id)
        .in("status", ["pending", "Pending"])
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (err: any) {
      console.error(err);
      Alert.alert(t("error"), err.message || "Failed to load requests.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchJoinRequests();
  };

  // Open modal with prefilled defaults
  const handleOpenApproveModal = (request: any) => {
    setSelectedRequest(request);
    setRoomNumber(request.requested_room_number && request.requested_room_number !== "TBD" ? request.requested_room_number : "101");
    setRentAmount("10000");
    setDueDate("5");
    setIsModalVisible(true);
  };

  // Confirm and process tenant approval with dynamic dependencies
  const handleConfirmApprove = async () => {
    if (!roomNumber.trim()) {
      Alert.alert(t("error"), "Please enter a valid room number.");
      return;
    }
    const parsedRent = parseFloat(rentAmount);
    if (isNaN(parsedRent) || parsedRent <= 0) {
      Alert.alert(t("error"), "Please enter a valid monthly rent amount.");
      return;
    }
    const parsedDueDate = parseInt(dueDate);
    if (isNaN(parsedDueDate) || parsedDueDate < 1 || parsedDueDate > 31) {
      Alert.alert(t("error"), "Please enter a valid due date (1 to 28/31).");
      return;
    }

    setLoading(true);
    setIsModalVisible(false);

    try {
      // 1. Update the request status to approved
      const { error: reqErr } = await supabase
        .from("join_requests")
        .update({ status: "Approved" })
        .eq("id", selectedRequest.id);

      if (reqErr) throw reqErr;

      // 2. Set tenant profile role in profiles
      await supabase
        .from("profiles")
        .update({ role: "tenant", full_name: selectedRequest.name })
        .eq("id", selectedRequest.tenant_id);

      // 3. Upsert tenant details in tenants
      const { data: existingTenant } = await supabase
        .from("tenants")
        .select("id, outstanding_amount")
        .eq("id", selectedRequest.tenant_id)
        .maybeSingle();

      const newOutstanding = parsedRent;

      if (existingTenant) {
        const { error: tenantErr } = await supabase
          .from("tenants")
          .update({
            pg_id: selectedRequest.pg_id,
            name: selectedRequest.name,
            phone: selectedRequest.phone || "",
            email: selectedRequest.email,
            room_number: roomNumber.trim(),
            rent_amount: parsedRent,
            due_date: parsedDueDate,
            status: "Unpaid", // Reset to Unpaid on new stay/invoice link
            outstanding_amount: newOutstanding
          })
          .eq("id", existingTenant.id);
        if (tenantErr) throw tenantErr;
      } else {
        const { error: tenantErr } = await supabase
          .from("tenants")
          .insert({
            id: selectedRequest.tenant_id,
            name: selectedRequest.name,
            email: selectedRequest.email,
            phone: selectedRequest.phone || "",
            room_number: roomNumber.trim(),
            pg_id: selectedRequest.pg_id,
            rent_amount: parsedRent,
            due_date: parsedDueDate,
            status: "Unpaid",
            outstanding_amount: newOutstanding
          });
        if (tenantErr) throw tenantErr;
      }

      // 4. Generate first billing invoice in payments table
      const today = new Date();
      const currentMonthYear = today.toLocaleString("en-US", { month: "long", year: "numeric" });
      const currentMonth = today.toLocaleString("en-US", { month: "long" });

      const dueYear = today.getFullYear();
      const dueMonth = String(today.getMonth() + 1).padStart(2, "0");
      const formattedDueDate = `${dueYear}-${dueMonth}-${String(parsedDueDate).padStart(2, "0")}`;

      const { error: invoiceError } = await supabase
        .from("payments")
        .insert({
          tenant_id: selectedRequest.tenant_id,
          tenant_email: selectedRequest.email,
          month: currentMonthYear,
          month_year: currentMonthYear,
          amount: parsedRent,
          status: "Pending",
          due_date: formattedDueDate,
          amount_paid: 0
        });

      if (invoiceError) {
        console.warn("Invoice generation failed:", invoiceError.message);
      }

      Alert.alert(t("success"), `${selectedRequest.name} has been successfully approved, assigned to Room ${roomNumber}, and their monthly dues generated!`);
      fetchJoinRequests();
    } catch (err: any) {
      console.error(err);
      Alert.alert(t("error"), err.message || "Failed to approve request.");
    } finally {
      setLoading(false);
      setSelectedRequest(null);
    }
  };

  // Decline pending resident request
  const handleRejectRequest = (request: any) => {
    Alert.prompt(
      t("decline"),
      t("enter_reason_decline"),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("decline"),
          style: "destructive",
          onPress: async (reason?: string) => {
            try {
              setLoading(true);
              const { error } = await supabase
                .from("join_requests")
                .update({ 
                  status: "Rejected",
                  rejection_reason: reason || "Disallowed by caretaker rules."
                })
                .eq("id", request.id);

              if (error) throw error;
              Alert.alert(t("success"), t("rejected_success"));
              fetchJoinRequests();
            } catch (err: any) {
              console.error(err);
              Alert.alert(t("error"), err.message || "Failed to decline.");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-surface-bg" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="h-10 w-10 bg-white border border-zinc-100 rounded-full items-center justify-center shadow-sm"
        >
          <ArrowLeft size={20} color="#1C1C1C" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text className="text-text-primary text-lg font-black tracking-tight">{t("approvals_title")}</Text>
        <View className="w-10" />
      </View>

      <ScrollView 
        className="flex-1 px-5" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#1C1C1C" />
        }
      >
        <View className="bg-white rounded-[32px] p-6 border border-zinc-100 mb-6 shadow-sm mt-2">
          <View className="flex-row items-center mb-4">
            <View className="h-10 w-10 bg-zinc-900 rounded-full items-center justify-center mr-3">
              <Users size={20} color="#CCFF00" strokeWidth={2.5} />
            </View>
            <View className="flex-1">
              <Text className="text-zinc-500 text-[10px] font-black uppercase tracking-wider">{t("joining_code")}</Text>
              <Text className="text-text-primary text-base font-black">
                {selectedProperty?.joining_code || "N/A"}
              </Text>
            </View>
          </View>
          <Text className="text-text-secondary text-xs font-semibold leading-relaxed">
            {t("joining_code_instruction")}
          </Text>
        </View>

        <Text className="text-text-secondary text-[11px] font-black uppercase tracking-widest mb-4 ml-1">
          {t("pending_approvals")} ({requests.length})
        </Text>

        {loading && !refreshing && requests.length === 0 ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator color="#1C1C1C" size="large" />
          </View>
        ) : requests.length === 0 ? (
          <View className="py-20 items-center justify-center bg-white rounded-[32px] border border-zinc-100 p-8 shadow-sm">
            <Users size={40} color="#D4D4D8" strokeWidth={1.5} style={{ marginBottom: 12 }} />
            <Text className="text-zinc-400 font-bold text-center italic text-sm">{t("no_approvals")}</Text>
            <Text className="text-zinc-400 text-xs text-center mt-1">{t("pending_requests_sub")}</Text>
          </View>
        ) : (
          requests.map((item) => (
            <View key={item.id} className="bg-white border border-zinc-100 rounded-[28px] p-5 mb-4 shadow-sm">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-1 mr-2">
                  <Text className="text-text-primary text-lg font-black">{item.name}</Text>
                  <View className="flex-row items-center mt-1">
                    <Mail size={12} color="#A1A1AA" style={{ marginRight: 4 }} />
                    <Text className="text-zinc-400 text-xs font-bold">{item.email}</Text>
                  </View>
                </View>
                <View className="bg-[#CCFF00] px-3.5 py-1.5 rounded-full border border-[#CCFF00]/10">
                  <Text className="text-black text-[10px] font-black uppercase">{t("room")} {item.requested_room_number || "TBD"}</Text>
                </View>
              </View>

              <View className="flex-row items-center mb-5 bg-zinc-50 p-3.5 rounded-xl border border-zinc-100">
                <Phone size={14} color="#71717A" style={{ marginRight: 8 }} />
                <Text className="text-zinc-700 text-xs font-bold">{item.phone || t("no_phone_provided")}</Text>
              </View>

              <View className="flex-row gap-3">
                <TouchableOpacity 
                  onPress={() => handleRejectRequest(item)}
                  className="flex-1 bg-zinc-100 rounded-xl h-12 items-center justify-center active:opacity-85 border border-zinc-200"
                >
                  <Text className="text-zinc-700 font-black text-xs">{t("decline")}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => handleOpenApproveModal(item)}
                  className="flex-1 bg-zinc-900 rounded-xl h-12 items-center justify-center active:opacity-85"
                >
                  <Text className="text-[#CCFF00] font-black text-xs">{t("approve")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <View style={{ height: insets.bottom + 40 }} />
      </ScrollView>

      {/* RENT AND ROOM ALLOCATION MODAL (AIRBNB THEME) */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="w-full"
          >
            <View className="bg-white rounded-t-[40px] px-6 pt-8 pb-10 border-t border-zinc-100 shadow-2xl">
              
              {/* Swipe/Indicator Bar */}
              <View className="w-12 h-1 bg-zinc-200 rounded-full self-center mb-6" />

              {/* Title & Micro-Aesthetics */}
              <View className="flex-row items-center mb-6">
                <View className="h-9 w-9 bg-[#CCFF00]/10 rounded-full items-center justify-center mr-3">
                  <Sparkles size={16} color="#1C1C1C" />
                </View>
                <View>
                  <Text className="text-[#1C1C1C] text-2xl font-black tracking-tight">Approve Resident</Text>
                  <Text className="text-zinc-500 text-xs font-semibold mt-0.5">Assign room and billing dues for {selectedRequest?.name}</Text>
                </View>
              </View>

              {/* Inputs List */}
              <View className="space-y-4">
                
                {/* Room Allocation */}
                <View>
                  <Text className="text-zinc-400 text-[10px] font-black uppercase tracking-wider mb-2 ml-1">Room Allocation</Text>
                  <View className="bg-zinc-50 border border-zinc-100 rounded-2xl h-14 flex-row items-center px-4">
                    <TextInput
                      className="flex-1 text-sm font-bold text-[#1C1C1C]"
                      placeholder="e.g. 101, 102A"
                      placeholderTextColor="#A1A1AA"
                      value={roomNumber}
                      onChangeText={setRoomNumber}
                    />
                  </View>
                </View>

                {/* Monthly Rent */}
                <View className="mt-3">
                  <Text className="text-zinc-400 text-[10px] font-black uppercase tracking-wider mb-2 ml-1">Monthly Rent Amount (₹)</Text>
                  <View className="bg-zinc-50 border border-zinc-100 rounded-2xl h-14 flex-row items-center px-4">
                    <TextInput
                      className="flex-1 text-sm font-bold text-[#1C1C1C]"
                      placeholder="Monthly Rent Amount"
                      placeholderTextColor="#A1A1AA"
                      value={rentAmount}
                      onChangeText={setRentAmount}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                {/* Rent Due Date */}
                <View className="mt-3">
                  <Text className="text-zinc-400 text-[10px] font-black uppercase tracking-wider mb-2 ml-1">Due Date (Day of Month)</Text>
                  <View className="bg-zinc-50 border border-zinc-100 rounded-2xl h-14 flex-row items-center px-4">
                    <Calendar size={18} color="#A1A1AA" style={{ marginRight: 10 }} />
                    <TextInput
                      className="flex-1 text-sm font-bold text-[#1C1C1C]"
                      placeholder="e.g. 5 for 5th of every month"
                      placeholderTextColor="#A1A1AA"
                      value={dueDate}
                      onChangeText={setDueDate}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

              </View>

              {/* Action CTAs */}
              <View className="flex-row space-x-3 mt-8">
                <TouchableOpacity
                  onPress={() => setIsModalVisible(false)}
                  className="flex-1 bg-zinc-100 h-14 rounded-full items-center justify-center active:opacity-75 border border-zinc-200"
                >
                  <Text className="text-[#1C1C1C] text-xs font-black uppercase tracking-wider">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleConfirmApprove}
                  className="flex-1 bg-zinc-900 h-14 rounded-full items-center justify-center active:opacity-90 shadow-md"
                >
                  <Text className="text-[#CCFF00] text-xs font-black uppercase tracking-wider">Confirm Approve</Text>
                </TouchableOpacity>
              </View>

            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}
