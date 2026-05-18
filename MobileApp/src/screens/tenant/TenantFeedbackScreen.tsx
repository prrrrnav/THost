// src/screens/tenant/TenantFeedbackScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Switch,
  ActivityIndicator, RefreshControl, Platform, Alert
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { 
  Sparkles, Check
} from "@/lib/icons";

export default function TenantFeedbackScreen() {
  const { session } = useAuth();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [pgId, setPgId] = useState<string | null>(null);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [feedRating, setFeedRating] = useState(5);
  const [feedComment, setFeedComment] = useState("");
  const [feedAnonymous, setFeedAnonymous] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const fetchFeedbackData = async () => {
    try {
      const userId = session?.user?.id;
      if (!userId) return;

      const { data: tenant, error: tenantError } = await supabase
        .from("tenants")
        .select("pg_id")
        .eq("id", userId)
        .maybeSingle();

      if (tenantError) throw tenantError;

      if (tenant?.pg_id) {
        setPgId(tenant.pg_id);

        const { data: reviewsList, error: reviewsError } = await supabase
          .from("feedback")
          .select("*, profiles:profiles(full_name)")
          .eq("pg_id", tenant.pg_id)
          .order("created_at", { ascending: false });

        if (reviewsError) throw reviewsError;
        setFeedbacks(reviewsList || []);
      }
    } catch (e) {
      console.warn("Error fetching feedback data:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFeedbackData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFeedbackData();
  };

  const handleSubmitFeedback = async () => {
    if (!feedComment.trim()) {
      Alert.alert("Missing Fields", "Please write a comment/suggestion.");
      return;
    }

    if (!pgId) {
      Alert.alert("Error", "Your account is not linked to any PG property.");
      return;
    }

    setSubmittingFeedback(true);
    try {
      const { error } = await supabase
        .from("feedback")
        .insert({
          pg_id: pgId,
          tenant_id: session?.user?.id,
          rating: feedRating,
          comment: feedComment.trim(),
          is_anonymous: feedAnonymous,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      Alert.alert("Review Posted", "Thank you for sharing your experience with your PG community!");
      setFeedComment("");
      setFeedRating(5);
      setFeedAnonymous(false);
      fetchFeedbackData();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not submit your feedback.");
    } finally {
      setSubmittingFeedback(false);
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
          PG Community Hub
        </Text>
        <Text className="text-[#1C1C1C] text-2xl font-black tracking-tight mt-0.5">
          Reviews & feedback
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
          
          {/* Section: Share PG Experience */}
          <Text className="text-[#1C1C1C] text-[15px] font-black tracking-tight mb-3 px-1">
            Write a review
          </Text>

          <View 
            className="bg-white p-6 rounded-[32px] border border-zinc-200/80 shadow-sm mb-6"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 }}
          >
            {/* Clickable Sparkles Rating Widget */}
            <Text className="text-zinc-400 text-[9px] font-black uppercase tracking-wider mb-2 px-1">
              Select rating
            </Text>
            <View className="flex-row space-x-2.5 mb-4 px-1">
              {[1, 2, 3, 4, 5].map(star => (
                <TouchableOpacity 
                  key={star} 
                  onPress={() => setFeedRating(star)}
                  className="p-1 active:scale-125"
                >
                  <Sparkles 
                    size={26} 
                    color={star <= feedRating ? "#CCFF00" : "#E4E4E7"} 
                    strokeWidth={2.5} 
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Comments Form Box */}
            <View className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4.5 mb-4 min-h-[110px]">
              <TextInput
                className="text-xs text-[#1C1C1C] font-bold flex-1"
                placeholder="Share your stay experience, room vibes, or food feedback..."
                placeholderTextColor="#A1A1AA"
                value={feedComment}
                onChangeText={setFeedComment}
                multiline
                textAlignVertical="top"
              />
            </View>

            {/* Anonymous Toggle with brand style highlights */}
            <View className="flex-row items-center justify-between p-4 rounded-2xl bg-zinc-50 border border-zinc-100 mb-5">
              <View className="flex-1 pr-4">
                <Text className="text-[#1C1C1C] text-[10px] font-black uppercase tracking-wider">Submit Anonymously</Text>
                <Text className="text-zinc-400 text-[8px] font-bold mt-0.5 uppercase tracking-wider">Hides your name from roommates & host</Text>
              </View>
              <Switch
                value={feedAnonymous}
                onValueChange={setFeedAnonymous}
                thumbColor={feedAnonymous ? "#1C1C1C" : "#F4F4F5"}
                trackColor={{ false: "#E4E4E7", true: "#CCFF00" }}
              />
            </View>

            <TouchableOpacity
              onPress={handleSubmitFeedback}
              disabled={submittingFeedback}
              className="bg-[#1C1C1C] h-14 rounded-full items-center justify-center flex-row active:opacity-90 shadow-sm"
            >
              {submittingFeedback ? (
                <ActivityIndicator color="#CCFF00" />
              ) : (
                <>
                  <Text className="text-white text-xs font-black uppercase tracking-wider">Submit Review</Text>
                  <Check size={14} color="#CCFF00" style={{ marginLeft: 6 }} strokeWidth={3} />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Section: PG Roommates Reviews */}
          <Text className="text-[#1C1C1C] text-[15px] font-black tracking-tight mb-3 px-1">
            PG roommate reviews
          </Text>

          <View 
            className="bg-white p-5 rounded-[32px] border border-zinc-200/80 shadow-sm"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 }}
          >
            {feedbacks.length > 0 ? (
              feedbacks.map((item, idx) => {
                const author = item.is_anonymous ? "Anonymous Roommate" : (item.profiles?.full_name || "Verified Resident");
                return (
                  <View 
                    key={item.id || idx}
                    className={`pb-5 mb-5 ${idx !== feedbacks.length - 1 ? 'border-b border-zinc-100' : ''}`}
                  >
                    <View className="flex-row items-center justify-between">
                      <Text className="text-[#1C1C1C] text-xs font-black">
                        {author}
                      </Text>
                      <View className="flex-row space-x-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Text key={s} className="text-[11px]" style={{ color: s <= item.rating ? "#CCFF00" : "#E4E4E7" }}>
                            ★
                          </Text>
                        ))}
                      </View>
                    </View>
                    
                    <Text className="text-zinc-500 text-xs mt-2 leading-5 font-semibold">
                      {item.comment}
                    </Text>
                    
                    {item.owner_response && (
                      <View className="bg-zinc-50 border border-zinc-100 p-3.5 rounded-2xl mt-3 border-l-4 border-l-[#CCFF00]">
                        <Text className="text-[#1C1C1C] text-[9px] font-black uppercase tracking-wider">Host Response</Text>
                        <Text className="text-zinc-500 text-xs font-semibold mt-1 leading-4">{item.owner_response}</Text>
                      </View>
                    )}

                    <Text className="text-zinc-400 text-[8px] mt-3.5 font-bold uppercase tracking-wider">
                      Posted: {item.created_at ? new Date(item.created_at).toLocaleDateString() : ""}
                    </Text>
                  </View>
                );
              })
            ) : (
              <View className="items-center py-8">
                <Text className="text-zinc-400 text-xs font-semibold">No reviews shared by PG roommates yet.</Text>
              </View>
            )}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}
