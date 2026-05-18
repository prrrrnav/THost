// src/screens/tenant/TenantComplaintsScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  ActivityIndicator, RefreshControl, Alert
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { 
  Wrench, Check
} from "@/lib/icons";

export default function TenantComplaintsScreen() {
  const { session, profile } = useAuth();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [complaints, setComplaints] = useState<any[]>([]);
  const [compSubject, setCompSubject] = useState("");
  const [compDesc, setCompDesc] = useState("");
  const [compCategory, setCompCategory] = useState("WiFi");
  const [submittingComplaint, setSubmittingComplaint] = useState(false);

  const userEmail = session?.user?.email || profile?.email;

  const fetchComplaints = async () => {
    try {
      const { data, error } = await supabase
        .from("complaints")
        .select("*")
        .eq("tenant_email", userEmail)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComplaints(data || []);
    } catch (e) {
      console.warn("Error fetching complaints:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchComplaints();
  };

  const handleSubmitComplaint = async () => {
    if (!compSubject.trim() || !compDesc.trim()) {
      Alert.alert("Missing Fields", "Please complete all fields before submitting.");
      return;
    }

    setSubmittingComplaint(true);
    try {
      const formattedSubject = `[${compCategory}] - ${compSubject.trim()}`;
      
      const { error } = await supabase
        .from("complaints")
        .insert({
          subject: formattedSubject,
          description: compDesc.trim(),
          status: "Pending",
          tenant_email: userEmail,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      Alert.alert("Request Submitted", "Your maintenance request has been logged successfully.");
      setCompSubject("");
      setCompDesc("");
      fetchComplaints();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not log maintenance request.");
    } finally {
      setSubmittingComplaint(false);
    }
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
          Support & Services
        </Text>
        <Text className="text-[#1C1C1C] text-2xl font-black tracking-tight mt-0.5">
          Maintenance requests
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
          
          {/* Section: Log New Maintenance Issue */}
          <Text className="text-[#1C1C1C] text-[15px] font-black tracking-tight mb-3 px-1">
            Report a new issue
          </Text>

          <View 
            className="bg-white p-6 rounded-[32px] border border-zinc-200/80 shadow-sm mb-6"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 }}
          >
            {/* Category Selectors */}
            <Text className="text-zinc-400 text-[9px] font-black uppercase tracking-wider mb-2.5 px-1">
              Select category
            </Text>
            <View className="flex-row flex-wrap gap-2 mb-5">
              {["WiFi", "Plumbing", "Electrical", "Cleaning", "Others"].map(cat => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCompCategory(cat)}
                  className={`px-4.5 py-2.5 rounded-full border ${compCategory === cat ? 'bg-[#1C1C1C] border-[#1C1C1C]' : 'bg-zinc-50 border-zinc-200'}`}
                >
                  <Text className={`text-[10px] font-black uppercase tracking-wider ${compCategory === cat ? 'text-[#CCFF00]' : 'text-zinc-500'}`}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Subject Input */}
            <View className="rounded-2xl h-14 border border-zinc-200 bg-zinc-50 px-4.5 mb-4 justify-center">
              <TextInput
                className="text-xs text-[#1C1C1C] font-bold"
                placeholder="Issue Title (e.g. Broken study lamp bulb)"
                placeholderTextColor="#A1A1AA"
                value={compSubject}
                onChangeText={setCompSubject}
              />
            </View>

            {/* Description Input */}
            <View className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4.5 mb-5 min-h-[110px]">
              <TextInput
                className="text-xs text-[#1C1C1C] font-bold flex-1"
                placeholder="Write a clear description of the issue for your host..."
                placeholderTextColor="#A1A1AA"
                value={compDesc}
                onChangeText={setCompDesc}
                multiline
                textAlignVertical="top"
              />
            </View>

            {/* Submit Button in Owner Style */}
            <TouchableOpacity
              onPress={handleSubmitComplaint}
              disabled={submittingComplaint}
              className="bg-[#1C1C1C] h-14 rounded-full items-center justify-center flex-row active:opacity-90 shadow-sm"
            >
              {submittingComplaint ? (
                <ActivityIndicator color="#CCFF00" />
              ) : (
                <>
                  <Text className="text-white text-xs font-black uppercase tracking-wider">Submit Fix Request</Text>
                  <Check size={14} color="#CCFF00" style={{ marginLeft: 6 }} strokeWidth={3} />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Section: Your Request Logs */}
          <Text className="text-[#1C1C1C] text-[15px] font-black tracking-tight mb-3 px-1">
            Request logs & updates
          </Text>

          <View 
            className="bg-white p-5 rounded-[32px] border border-zinc-200/80 shadow-sm"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 }}
          >
            {complaints.length > 0 ? (
              complaints.map((item, idx) => {
                const isResolved = item.status?.toLowerCase() === "resolved";
                return (
                  <View 
                    key={item.id || idx}
                    className={`pb-4 mb-4 ${idx !== complaints.length - 1 ? 'border-b border-zinc-100' : ''}`}
                  >
                    <View className="flex-row justify-between items-center">
                      <Text className="text-[#1C1C1C] text-xs font-black tracking-tight flex-1 mr-2">
                        {item.subject}
                      </Text>
                      <View 
                        className="px-2.5 py-1 rounded-full border"
                        style={{
                          backgroundColor: isResolved ? "rgba(34, 197, 94, 0.06)" : "rgba(251, 191, 36, 0.06)",
                          borderColor: isResolved ? "rgba(34, 197, 94, 0.12)" : "rgba(251, 191, 36, 0.12)"
                        }}
                      >
                        <Text 
                          className="text-[8px] font-black uppercase tracking-wider"
                          style={{ color: isResolved ? "#22C55E" : "#D97706" }}
                        >
                          {item.status || "Pending"}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-zinc-500 text-xs mt-1.5 leading-5 font-semibold">
                      {item.description}
                    </Text>
                    <Text className="text-zinc-400 text-[8px] mt-2 font-bold uppercase tracking-wider">
                      Submitted: {item.created_at ? new Date(item.created_at).toLocaleDateString() : ""}
                    </Text>
                  </View>
                );
              })
            ) : (
              <View className="items-center py-8">
                <Text className="text-zinc-400 text-xs font-semibold">No maintenance requests logged yet.</Text>
              </View>
            )}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}
