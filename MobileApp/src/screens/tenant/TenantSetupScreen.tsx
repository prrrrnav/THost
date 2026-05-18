// src/screens/tenant/TenantSetupScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { User, Phone, ChevronRight, ArrowLeft, LogOut, Clock, ShieldCheck } from "@/lib/icons";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export default function TenantSetupScreen() {
  const { session, profile, signOut } = useAuth();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState<1 | 2>(1);
  const [fullName, setFullName] = useState(profile?.full_name || session?.user?.user_metadata?.full_name || "");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pgCode, setPgCode] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pendingRequest, setPendingRequest] = useState<any>(null);
  const [checkingPending, setCheckingPending] = useState(true);

  // Fetch pending or rejected requests for the logged-in tenant
  const fetchPendingRequest = async () => {
    try {
      const userId = session?.user?.id;
      if (!userId) return;

      const { data, error: fetchErr } = await supabase
        .from("join_requests")
        .select(`
          *,
          pg_details:pg_id (
            name,
            address
          )
        `)
        .eq("tenant_id", userId)
        .in("status", ["pending", "Pending", "rejected", "Rejected"])
        .order("created_at", { ascending: false });

      if (fetchErr) throw fetchErr;

      if (data && data.length > 0) {
        setPendingRequest(data[0]); // Set the latest request
      } else {
        setPendingRequest(null);
      }
    } catch (err) {
      console.log("Error checking pending request:", err);
    } finally {
      setCheckingPending(false);
    }
  };

  useEffect(() => {
    fetchPendingRequest();
  }, [session]);

  const handleNextStep = () => {
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!phoneNumber.trim()) {
      setError("Please enter your phone number.");
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleConnectCode = async () => {
    if (!pgCode.trim()) {
      setError("Please enter your property joining code.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userEmail = session?.user?.email || profile?.email;
      const userId = session?.user?.id;

      if (!userId) {
        setError("User session not found.");
        setLoading(false);
        return;
      }

      // 1. Find the property by joining code
      const { data: pgDetails, error: pgError } = await supabase
        .from("pg_details")
        .select("*")
        .eq("joining_code", pgCode.trim().toUpperCase())
        .maybeSingle();

      if (pgError) {
        setError("Error validating joining code. Please try again.");
        setLoading(false);
        return;
      }

      if (!pgDetails) {
        setError("This PG joining code does not exist. Please check with your PG Owner.");
        setLoading(false);
        return;
      }

      // 2. Check if a request already exists for this tenant
      const { data: existingRequest } = await supabase
        .from("join_requests")
        .select("id")
        .eq("tenant_id", userId)
        .eq("status", "pending")
        .maybeSingle();

      if (existingRequest) {
        setError("You already have a pending join request. Please wait for owner approval.");
        setLoading(false);
        return;
      }

      // 3. Send join request to join_requests table
      const { error: insertReqError } = await supabase
        .from("join_requests")
        .insert({
          pg_id: pgDetails.id,
          tenant_id: userId,
          name: fullName.trim(),
          email: userEmail,
          phone: phoneNumber.trim(),
          requested_room_number: "TBD",
          status: "Pending" // PascalCase to satisfy DB check constraint
        });

      if (insertReqError) {
        setError(`Failed to send request: ${insertReqError.message}`);
        setLoading(false);
        return;
      }

      // 4. Save profile/tenant setup details (with pg_id = null until approved)
      const { data: existingTenant } = await supabase
        .from("tenants")
        .select("id")
        .eq("id", userId)
        .maybeSingle();

      if (existingTenant) {
        await supabase
          .from("tenants")
          .update({
            name: fullName.trim(),
            phone: phoneNumber.trim(),
            email: userEmail
          })
          .eq("id", userId);
      } else {
        await supabase
          .from("tenants")
          .insert({
            id: userId,
            name: fullName.trim(),
            phone: phoneNumber.trim(),
            email: userEmail,
            pg_id: null,
            room_number: "Unassigned",
            rent_amount: 0,
            due_date: 1,
            status: "Unpaid",
            outstanding_amount: 0
          });
      }

      // 5. Set user role to tenant
      await supabase
        .from("profiles")
        .update({ role: "tenant", full_name: fullName.trim() })
        .eq("id", userId);

      Alert.alert(
        "Request Sent!",
        `Your request to join "${pgDetails.name}" has been sent successfully. The PG Owner can approve or deny your request in their dashboard.`,
        [{ text: "OK", onPress: () => {
          fetchPendingRequest();
        }}]
      );

    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!pendingRequest) return;
    
    Alert.alert(
      "Cancel Request?",
      "Are you sure you want to cancel your pending connection request?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              const { error: cancelError } = await supabase
                .from("join_requests")
                .delete()
                .eq("id", pendingRequest.id);

              if (cancelError) throw cancelError;
              
              setPendingRequest(null);
              setError(null);
              setStep(1);
              Alert.alert("Request Cancelled", "You can now enter a new invite code.");
            } catch (err: any) {
              Alert.alert("Error", err.message || "Failed to cancel request.");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleDismissRejection = async () => {
    if (!pendingRequest) return;
    setLoading(true);
    try {
      const { error: dismissError } = await supabase
        .from("join_requests")
        .delete()
        .eq("id", pendingRequest.id);

      if (dismissError) throw dismissError;
      
      setPendingRequest(null);
      setError(null);
      setStep(1);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to clear request.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingPending) {
    return (
      <View className="flex-1 bg-[#FCFCFC] items-center justify-center">
        <ActivityIndicator size="large" color="#1C1C1C" />
      </View>
    );
  }

  // RENDER PENDING STATE
  if (pendingRequest && pendingRequest.status?.toLowerCase() === "pending") {
    return (
      <View className="flex-1 bg-[#FCFCFC]" style={{ paddingTop: insets.top }}>
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          className="px-6"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row justify-end items-center mt-6">
            <TouchableOpacity
              onPress={() => signOut()}
              className="flex-row items-center bg-zinc-100 px-4 py-2 rounded-full border border-zinc-200 active:opacity-75"
            >
              <LogOut size={14} color="#1C1C1C" style={{ marginRight: 6 }} strokeWidth={2.5} />
              <Text className="text-[#1C1C1C] text-xs font-black uppercase tracking-wider">Log Out</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-1 justify-center py-10">
            <View className="items-center mb-8">
              <View className="bg-[#CCFF00]/10 p-5 rounded-full mb-4 border border-[#CCFF00]/30">
                <Clock size={36} color="#1C1C1C" strokeWidth={1.5} />
              </View>
              <Text className="text-[#1C1C1C] text-3xl font-black tracking-tighter text-center">
                Request Pending
              </Text>
              <Text className="text-zinc-500 text-sm mt-3 font-semibold text-center px-6 leading-6">
                Your connection request has been sent to the PG Host. Please wait for their approval.
              </Text>
            </View>

            {/* Gorgeous Airbnb Info Card */}
            <View 
              className="bg-white p-6 rounded-[32px] border border-zinc-200/80 shadow-sm mb-8"
              style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 }}
            >
              <Text className="text-zinc-400 text-[9px] font-black uppercase tracking-wider mb-4 border-b border-zinc-100 pb-2">
                Connection details
              </Text>

              <View className="mb-4">
                <Text className="text-zinc-400 text-[8px] font-black uppercase tracking-wider">PG Property</Text>
                <Text className="text-[#1C1C1C] text-base font-black mt-0.5">{pendingRequest.pg_details?.name || "Greenfield PG"}</Text>
              </View>

              <View className="mb-4">
                <Text className="text-zinc-400 text-[8px] font-black uppercase tracking-wider">Address</Text>
                <Text className="text-zinc-500 text-xs font-semibold mt-0.5 leading-4">{pendingRequest.pg_details?.address || "N/A"}</Text>
              </View>

              <View className="mb-4">
                <Text className="text-zinc-400 text-[8px] font-black uppercase tracking-wider">Name Submitted</Text>
                <Text className="text-[#1C1C1C] text-xs font-bold mt-0.5">{pendingRequest.name}</Text>
              </View>

              <View>
                <Text className="text-zinc-400 text-[8px] font-black uppercase tracking-wider">Phone Submitted</Text>
                <Text className="text-[#1C1C1C] text-xs font-bold mt-0.5">{pendingRequest.phone || "Not Configured"}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleCancelRequest}
              disabled={loading}
              className="bg-[#1C1C1C] h-14 rounded-full items-center justify-center flex-row active:opacity-90 shadow-sm"
            >
              {loading ? (
                <ActivityIndicator color="#CCFF00" />
              ) : (
                <Text className="text-white text-xs font-black uppercase tracking-wider">Cancel Request</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={{ paddingBottom: insets.bottom + 15 }}>
            <Text className="text-zinc-400 text-xs text-center font-bold uppercase tracking-widest">
              Caretaker pending approval list
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  // RENDER REJECTED/DECLINED STATE
  if (pendingRequest && pendingRequest.status?.toLowerCase() === "rejected") {
    return (
      <View className="flex-1 bg-[#FCFCFC]" style={{ paddingTop: insets.top }}>
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          className="px-6"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row justify-end items-center mt-6">
            <TouchableOpacity
              onPress={() => signOut()}
              className="flex-row items-center bg-zinc-100 px-4 py-2 rounded-full border border-zinc-200 active:opacity-75"
            >
              <LogOut size={14} color="#1C1C1C" style={{ marginRight: 6 }} strokeWidth={2.5} />
              <Text className="text-[#1C1C1C] text-xs font-black uppercase tracking-wider">Log Out</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-1 justify-center py-10">
            <View className="items-center mb-8">
              <View className="bg-red-50 p-5 rounded-full mb-4 border border-red-100">
                <ShieldCheck size={36} color="#FF5A5F" strokeWidth={1.5} />
              </View>
              <Text className="text-[#1C1C1C] text-3xl font-black tracking-tighter text-center">
                Request Declined
              </Text>
              <Text className="text-zinc-500 text-sm mt-3 font-semibold text-center px-6 leading-6">
                Your connection request has been declined by the caretaker/owner.
              </Text>
            </View>

            {/* Gorgeous Declined Card */}
            <View 
              className="bg-white p-6 rounded-[32px] border border-red-100 shadow-sm mb-8"
              style={{ shadowColor: '#FF5A5F', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 10, elevation: 1 }}
            >
              <Text className="text-red-400 text-[9px] font-black uppercase tracking-wider mb-4 border-b border-red-50 pb-2">
                Rejection reason
              </Text>
              <Text className="text-zinc-700 text-xs font-bold leading-5">
                {pendingRequest.rejection_reason || "No explicit reason was provided by the caretaker."}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleDismissRejection}
              disabled={loading}
              className="bg-[#1C1C1C] h-14 rounded-full items-center justify-center flex-row active:opacity-90 shadow-sm"
            >
              {loading ? (
                <ActivityIndicator color="#CCFF00" />
              ) : (
                <Text className="text-white text-xs font-black uppercase tracking-wider">Try Again / Enter New Code</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // STANDARD PROFILE DETAILS / CODE SUBMISSION FLOW
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#FCFCFC]"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top }}
        className="px-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Navigation Bar */}
        <View className="flex-row justify-between items-center mt-6">
          {step === 2 ? (
            <TouchableOpacity
              onPress={() => { setStep(1); setError(null); }}
              className="p-3 bg-white rounded-full border border-zinc-200 shadow-sm active:opacity-75"
            >
              <ArrowLeft size={18} color="#1C1C1C" strokeWidth={3} />
            </TouchableOpacity>
          ) : (
            <View />
          )}

          <TouchableOpacity
            onPress={() => signOut()}
            className="flex-row items-center bg-zinc-100 px-4 py-2 rounded-full active:opacity-75 border border-zinc-200"
          >
            <LogOut size={14} color="#1C1C1C" style={{ marginRight: 6 }} strokeWidth={2.5} />
            <Text className="text-[#1C1C1C] text-xs font-black uppercase tracking-wider">Log Out</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1 justify-center py-8">
          
          {/* Animated Process Indicator */}
          <View className="flex-row justify-center space-x-2 mb-8 items-center">
            <View className={`h-2.5 rounded-full ${step === 1 ? 'w-10 bg-[#1C1C1C]' : 'w-2.5 bg-zinc-200'}`} />
            <View className={`h-2.5 rounded-full ${step === 2 ? 'w-10 bg-[#1C1C1C]' : 'w-2.5 bg-zinc-200'}`} />
          </View>

          {/* Stepper Typography */}
          <View className="mb-10 items-center">
            <Text className="text-[#1C1C1C] text-4xl font-black tracking-tighter text-center">
              {step === 1 ? "Your Profile" : "Connect PG"}
            </Text>
            <Text className="text-zinc-500 text-sm mt-3 font-semibold text-center px-10 leading-6">
              {step === 1 
                ? "Let's complete your details so your PG Owner can identify you." 
                : "Enter the secure invite code provided by your PG Owner to connect."}
            </Text>
          </View>

          {/* Premium Card Form */}
          <View
            className="bg-white p-7 rounded-[36px] border border-zinc-200/80 shadow-sm"
            style={{
              shadowColor: '#1C1C1C',
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.03,
              shadowRadius: 24,
              elevation: 4
            }}
          >
            {error && (
              <View
                className="p-4 rounded-2xl mb-5"
                style={{
                  backgroundColor: 'rgba(255, 90, 95, 0.06)',
                  borderColor: 'rgba(255, 90, 95, 0.15)',
                  borderWidth: 1.5
                }}
              >
                <Text className="text-[#FF5A5F] text-xs font-black text-center">{error}</Text>
              </View>
            )}

            {step === 1 ? (
              <>
                {/* Full Name Input */}
                <View className="mb-4">
                  <View className="rounded-2xl h-16 flex-row items-center px-5 border-2 border-zinc-100 bg-zinc-50">
                    <User size={20} color="#A1A1AA" style={{ marginRight: 12 }} />
                    <TextInput
                      className="flex-1 text-base text-[#1C1C1C] font-black h-full"
                      placeholder="Full Name"
                      placeholderTextColor="#A1A1AA"
                      value={fullName}
                      onChangeText={setFullName}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                {/* Phone Number Input */}
                <View className="mb-6">
                  <View className="rounded-2xl h-16 flex-row items-center px-5 border-2 border-zinc-100 bg-zinc-50">
                    <Phone size={20} color="#A1A1AA" style={{ marginRight: 12 }} />
                    <TextInput
                      className="flex-1 text-base text-[#1C1C1C] font-black h-full"
                      placeholder="Phone Number"
                      placeholderTextColor="#A1A1AA"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>

                {/* Next Step Button */}
                <TouchableOpacity
                  onPress={handleNextStep}
                  className="bg-[#1C1C1C] h-16 rounded-full items-center justify-center flex-row active:opacity-90 shadow-md"
                  activeOpacity={0.85}
                >
                  <Text className="text-white text-sm font-black uppercase tracking-wider">Next Step</Text>
                  <ChevronRight size={16} color="#CCFF00" style={{ marginLeft: 8 }} strokeWidth={3} />
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* PG Code Input */}
                <View className="mb-4">
                  <View className="rounded-2xl h-16 flex-row items-center px-5 border-2 border-zinc-100 bg-zinc-50">
                    <TextInput
                      className="flex-1 text-base text-[#1C1C1C] font-black h-full text-center tracking-widest uppercase"
                      placeholder="ENTER PG CODE"
                      placeholderTextColor="#A1A1AA"
                      value={pgCode}
                      onChangeText={setPgCode}
                      autoCapitalize="characters"
                    />
                  </View>
                </View>

                {/* Warning note explicitly requested */}
                <View className="bg-zinc-50 p-4 rounded-2xl mb-6 border border-zinc-100">
                  <Text className="text-zinc-500 text-xs font-semibold leading-5 text-center">
                    💡 <Text className="font-bold text-[#1C1C1C]">Don't have a code?</Text> Contact your PG Owner to get the property invite code.
                  </Text>
                </View>

                {/* Connect Property Button */}
                <TouchableOpacity
                  onPress={handleConnectCode}
                  disabled={loading}
                  className="bg-[#1C1C1C] h-16 rounded-full items-center justify-center flex-row active:opacity-90 shadow-md"
                  activeOpacity={0.85}
                >
                  {loading ? (
                    <ActivityIndicator color="#CCFF00" />
                  ) : (
                    <>
                      <Text className="text-white text-sm font-black uppercase tracking-wider">Connect Property</Text>
                      <View className="h-2 w-2 rounded-full bg-[#CCFF00] ml-3" />
                    </>
                  )}
                </TouchableOpacity>
              </>
            )}

          </View>
        </View>

        <View style={{ paddingBottom: insets.bottom + 15 }}>
          <Text className="text-zinc-400 text-xs text-center font-bold uppercase tracking-widest">
            Host platform
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
