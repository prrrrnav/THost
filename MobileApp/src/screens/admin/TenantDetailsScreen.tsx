import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Modal } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { X, ChevronDown, Check, Building2, User, Phone, Wallet, Calendar, Clock, Building } from "@/lib/icons";
import { supabase } from "@/lib/supabase";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "@/context/AuthContext";

const InputField = ({ label, value, onChangeText, placeholder, keyboardType = "default", icon: Icon }: any) => (
  <View className="mb-5">
    <Text className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">{label}</Text>
    <View className="bg-[#161618] rounded-2xl h-14 flex-row items-center px-4 border border-zinc-800">
      {Icon && <Icon size={18} color="#71717a" style={{ marginRight: 12 }} />}
      <TextInput
        className="flex-1 text-white font-bold text-base h-full"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#3f3f46"
        keyboardType={keyboardType}
      />
    </View>
  </View>
);

export default function TenantDetailsScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { tenant, properties } = route.params || {};
  const { profile, selectedProperty } = useAuth();

  const [loading, setLoading] = useState(false);
  const [propertiesList, setPropertiesList] = useState<any[]>(properties || []);
  const [showPropertyPicker, setShowPropertyPicker] = useState(false);
  
  const [formData, setFormData] = useState({
    name: tenant?.name || "",
    phone: tenant?.phone || "",
    pg_id: tenant?.pg_id || selectedProperty?.id || "",
    room_number: tenant?.room_number || "",
    rent_amount: tenant?.rent_amount?.toString() || "",
    due_date: tenant?.due_date?.toString() || "",
    status: tenant?.status || "Paid",
  });

  useEffect(() => {
    if (!properties || properties.length === 0) {
      if (profile?.id) {
        supabase.from("pg_details").select("*").eq("owner_id", profile.id).then(({ data }) => {
          if (data) {
            setPropertiesList(data);
            if (!formData.pg_id && data.length > 0) {
               setFormData(prev => ({ ...prev, pg_id: data[0].id }));
            }
          }
        });
      }
    }
  }, [profile?.id]);

  const handleSave = async () => {
    if (!formData.name) {
      Alert.alert("Error", "Name is required");
      return;
    }

    try {
      setLoading(true);
      let savedTenantId = tenant?.id;

      if (tenant?.id) {
        // Update existing tenant
        const { error } = await supabase
          .from("tenants")
          .update({
            name: formData.name,
            phone: formData.phone,
            pg_id: formData.pg_id,
            room_number: formData.room_number,
            rent_amount: parseFloat(formData.rent_amount) || 0,
            due_date: parseInt(formData.due_date) || 1,
            status: formData.status,
          })
          .eq("id", tenant.id);

        if (error) throw error;
      } else {
        // Insert new tenant
        const { data: newTenant, error } = await supabase
          .from("tenants")
          .insert({
            name: formData.name,
            phone: formData.phone,
            pg_id: formData.pg_id,
            room_number: formData.room_number,
            rent_amount: parseFloat(formData.rent_amount) || 0,
            due_date: parseInt(formData.due_date) || 1,
            status: formData.status,
          })
          .select()
          .single();

        if (error) throw error;
        if (newTenant) savedTenantId = newTenant.id;
      }

      // Create a payment transaction log for any status change to show in Dashboard
      // Also log if it's a new tenant and they already paid or have pending status
      if (formData.status !== tenant?.status && savedTenantId) {
        const { error: paymentError } = await supabase.from("pg_transactions").insert({
          tenant_id: savedTenantId,
          pg_id: formData.pg_id,
          amount: parseFloat(formData.rent_amount) || 0,
          status: formData.status,
          title: `${formData.name} Rent`,
          type: 'Income'
        });
        
        if (paymentError) {
          console.error("Payment Insert Error:", paymentError);
        }
      }

      // --- SYNC WITH PAYMENTS TABLE ---
      if (savedTenantId) {
        try {
          const currentDate = new Date();
          const currentMonthStr = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
          const paymentDateStr = currentDate.toISOString().split('T')[0];
          const rentVal = parseFloat(formData.rent_amount) || 0;

          const paymentRecord = {
            tenant_id: savedTenantId,
            tenant_email: tenant?.email || "",
            month: currentMonthStr,
            month_year: currentMonthStr,
            amount: rentVal,
            status: formData.status,
            due_date: new Date(currentDate.getFullYear(), currentDate.getMonth(), parseInt(formData.due_date) || 5).toISOString().split('T')[0],
            amount_paid: formData.status === "Paid" ? rentVal : 0,
            payment_date: formData.status === "Paid" ? paymentDateStr : null
          };

          const { data: existingPayment } = await supabase
            .from("payments")
            .select("id")
            .eq("tenant_id", savedTenantId)
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
      }

      Alert.alert("Success", tenant?.id ? "Tenant details updated successfully" : "Tenant added successfully");
      navigation.goBack();
    } catch (err) {
      console.error("Error updating tenant:", err);
      Alert.alert("Error", "Failed to update tenant details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Remove Tenant",
      `Are you sure you want to remove ${tenant.name}? This action will update your occupancy and expected revenue immediately.`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              const { error } = await supabase
                .from("tenants")
                .delete()
                .eq("id", tenant.id);
              
              if (error) throw error;
              
              Alert.alert("Success", "Tenant removed successfully");
              navigation.goBack();
            } catch (error: any) {
              console.error("Delete error:", error);
              Alert.alert("Error", error.message || "Failed to remove tenant");
              setLoading(false);
            }
          }
        }
      ]
    );
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
            <Text className="text-white text-2xl font-black tracking-tight">Edit Tenant Details</Text>
            <Text className="text-zinc-500 text-sm font-medium mt-1">Update resident information and payment status.</Text>
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
            label="Full Name" 
            value={formData.name} 
            onChangeText={(t: string) => setFormData({...formData, name: t})}
            placeholder="John Doe"
            icon={User}
          />
          
          <InputField 
            label="WhatsApp Number" 
            value={formData.phone} 
            onChangeText={(t: string) => setFormData({...formData, phone: t})}
            placeholder="9876543210"
            keyboardType="phone-pad"
            icon={Phone}
          />

          {/* PG Property Picker */}
          <View className="mb-5">
            <Text className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">PG Property</Text>
            <TouchableOpacity 
              onPress={() => setShowPropertyPicker(true)}
              className="bg-[#161618] rounded-2xl h-14 flex-row items-center px-4 border border-zinc-800 justify-between"
            >
              <View className="flex-row items-center">
                <Building2 size={18} color="#71717a" style={{ marginRight: 12 }} />
                <Text className="text-white font-bold text-base">
                  {propertiesList.find((p: any) => p.id === formData.pg_id)?.name || "Select Property"}
                </Text>
              </View>
              <ChevronDown size={20} color="#71717a" />
            </TouchableOpacity>
          </View>

          <InputField 
            label="Room Number" 
            value={formData.room_number} 
            onChangeText={(t: string) => setFormData({...formData, room_number: t})}
            placeholder="15"
            icon={Building}
          />

          <View className="flex-row gap-4">
            <View className="flex-1">
              <InputField 
                label="Rent Amount" 
                value={formData.rent_amount} 
                onChangeText={(t: string) => setFormData({...formData, rent_amount: t})}
                placeholder="8500"
                keyboardType="numeric"
                icon={Wallet}
              />
            </View>
            <View className="flex-1">
              <InputField 
                label="Due Date" 
                value={formData.due_date} 
                onChangeText={(t: string) => setFormData({...formData, due_date: t})}
                placeholder="5"
                keyboardType="numeric"
                icon={Calendar}
              />
            </View>
          </View>

          {/* Status Picker (Simple) */}
          <View className="mb-10">
            <Text className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Payment Status</Text>
            <View className="flex-row gap-2">
              {['Paid', 'Unpaid', 'Due'].map((s) => (
                <TouchableOpacity 
                  key={s}
                  onPress={() => setFormData({...formData, status: s})}
                  className={`flex-1 h-12 rounded-xl items-center justify-center border ${formData.status === s ? 'bg-[#CCFF00] border-[#CCFF00]' : 'bg-[#161618] border-zinc-800'}`}
                >
                  <Text className={`font-bold ${formData.status === s ? 'text-black' : 'text-zinc-500'}`}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity 
            onPress={handleSave}
            disabled={loading}
            className={`bg-[#CCFF00] rounded-2xl h-16 items-center justify-center shadow-lg shadow-[#CCFF00]/20 ${tenant?.id ? 'mb-4' : 'mb-10'}`}
          >
            {loading ? <ActivityIndicator color="#000" /> : (
              <Text className="text-black font-black text-lg">Save Changes</Text>
            )}
          </TouchableOpacity>

          {tenant?.id && (
            <TouchableOpacity 
              onPress={handleDelete}
              disabled={loading}
              className="bg-[#161618] border border-[#FF3D00]/50 rounded-2xl h-16 items-center justify-center mb-10"
            >
              <Text className="text-[#FF3D00] font-black text-lg">Remove Tenant</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      {/* Property Picker Modal */}
      <Modal
        visible={showPropertyPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPropertyPicker(false)}
      >
        <View className="flex-1 justify-end bg-black/80">
          <View className="bg-[#161618] rounded-t-3xl pt-6 pb-10 px-6 border-t border-zinc-800" style={{ maxHeight: '80%' }}>
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-white text-xl font-black">Select Property</Text>
              <TouchableOpacity onPress={() => setShowPropertyPicker(false)} className="h-8 w-8 bg-zinc-800 rounded-full items-center justify-center">
                <X size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {propertiesList.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => {
                    setFormData({ ...formData, pg_id: p.id });
                    setShowPropertyPicker(false);
                  }}
                  className={`flex-row items-center justify-between p-4 mb-3 rounded-2xl border ${formData.pg_id === p.id ? 'bg-zinc-800/50 border-[#CCFF00]/50' : 'bg-[#0D0D0F] border-zinc-800'}`}
                >
                  <View className="flex-row items-center flex-1">
                    <View className={`h-10 w-10 rounded-full items-center justify-center mr-4 ${formData.pg_id === p.id ? 'bg-[#CCFF00]/20' : 'bg-zinc-800'}`}>
                      <Building2 size={18} color={formData.pg_id === p.id ? '#CCFF00' : '#A1A1AA'} />
                    </View>
                    <View>
                      <Text className={`font-bold text-base ${formData.pg_id === p.id ? 'text-white' : 'text-zinc-300'}`}>{p.name}</Text>
                      <Text className="text-zinc-500 text-xs mt-0.5">{p.address || "No address"}</Text>
                    </View>
                  </View>
                  {formData.pg_id === p.id && (
                    <View className="h-6 w-6 rounded-full bg-[#CCFF00] items-center justify-center">
                      <Check size={14} color="#000000" strokeWidth={3} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
