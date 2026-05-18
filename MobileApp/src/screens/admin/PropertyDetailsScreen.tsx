import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { X, Building2, Globe, Bed, FileText, Check } from "@/lib/icons";
import { supabase } from "@/lib/supabase";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "@/context/AuthContext";

const InputField = ({ label, value, onChangeText, placeholder, keyboardType = "default", icon: Icon, multiline = false, editable = true }: any) => (
  <View className="mb-5">
    <Text className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">{label}</Text>
    <View className={`bg-[#161618] rounded-2xl ${multiline ? 'h-32 py-4' : 'h-14 items-center'} flex-row px-4 border border-zinc-800 ${!editable ? 'opacity-50' : ''}`}>
      {Icon && <Icon size={18} color="#71717a" style={{ marginRight: 12, marginTop: multiline ? 2 : 0 }} />}
      <TextInput
        className="flex-1 text-white font-bold text-base h-full"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#3f3f46"
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        editable={editable}
      />
    </View>
  </View>
);

export default function PropertyDetailsScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  
  const { property } = route.params || {};
  const isEditing = !!property;

  const [loading, setLoading] = useState(false);
  // Generate a random 6-character alphanumeric code
  const generateJoiningCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const [formData, setFormData] = useState({
    name: property?.name || "",
    address: property?.address || "",
    total_beds: property?.total_beds?.toString() || "",
    joining_code: property?.joining_code || generateJoiningCode(),
    rules: property?.rules || "",
  });

  const handleSave = async () => {
    if (!formData.name || !formData.address) {
      Alert.alert("Error", "Name and Address are required");
      return;
    }

    try {
      setLoading(true);
      
      const payload = {
        name: formData.name,
        address: formData.address,
        total_beds: parseInt(formData.total_beds) || 0,
        joining_code: formData.joining_code,
        rules: formData.rules,
        owner_id: profile?.id,
      };

      if (isEditing) {
        const { error } = await supabase
          .from("pg_details")
          .update(payload)
          .eq("id", property.id);

        if (error) throw error;
        Alert.alert("Success", "Property details updated successfully");
      } else {
        const { error } = await supabase
          .from("pg_details")
          .insert([payload]);

        if (error) throw error;
        Alert.alert("Success", "New property added successfully");
      }
      
      navigation.goBack();
    } catch (err) {
      console.error("Error saving property:", err);
      Alert.alert("Error", "Failed to save property details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#0D0D0F]"
    >
      <View className="flex-1" style={{ paddingTop: insets.top }}>
        {/* Header */}
        <View className="flex-row justify-between items-center px-6 py-4">
          <View className="flex-1 mr-4">
            <Text className="text-white text-2xl font-black tracking-tight">{isEditing ? "Edit Property" : "Add Property"}</Text>
            <Text className="text-zinc-500 text-sm font-medium mt-1">
              {isEditing ? "Update your PG building details." : "Register a new PG building."}
            </Text>
          </View>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="h-10 w-10 bg-zinc-800 rounded-full items-center justify-center"
          >
            <X size={20} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6 mt-4" showsVerticalScrollIndicator={false}>
          <InputField 
            label="Property Name" 
            value={formData.name} 
            onChangeText={(t: string) => setFormData({...formData, name: t})}
            placeholder="Thehost Boys PG"
            icon={Building2}
          />
          
          <InputField 
            label="Full Address" 
            value={formData.address} 
            onChangeText={(t: string) => setFormData({...formData, address: t})}
            placeholder="Sector 62, Noida"
            icon={Globe}
          />

          <View className="flex-row gap-4">
            <View className="flex-1">
              <InputField 
                label="Total Beds" 
                value={formData.total_beds} 
                onChangeText={(t: string) => setFormData({...formData, total_beds: t})}
                placeholder="50"
                keyboardType="numeric"
                icon={Bed}
              />
            </View>
            <View className="flex-1">
              <InputField 
                label="Joining Code" 
                value={formData.joining_code} 
                onChangeText={(t: string) => setFormData({...formData, joining_code: t})}
                placeholder="PG123"
                icon={Check}
                editable={false}
              />
            </View>
          </View>

          <InputField 
            label="House Rules (Optional)" 
            value={formData.rules} 
            onChangeText={(t: string) => setFormData({...formData, rules: t})}
            placeholder="No smoking\nGate closes at 10 PM"
            icon={FileText}
            multiline={true}
          />

          <TouchableOpacity 
            onPress={handleSave}
            disabled={loading}
            className="bg-[#CCFF00] rounded-2xl h-16 items-center justify-center mb-10 shadow-lg shadow-[#CCFF00]/20 mt-4"
          >
            {loading ? <ActivityIndicator color="#000" /> : (
              <Text className="text-black font-black text-lg">Save Property</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
