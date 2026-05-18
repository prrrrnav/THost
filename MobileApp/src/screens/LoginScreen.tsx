// src/screens/LoginScreen.tsx
import React, { useState } from "react";
import {
  View, Text, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/context/LocalizationContext";
import GoogleLoginButton from "../components/GoogleLoginButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const [selectedRole, setSelectedRole] = useState<"admin" | "tenant">("admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();
  const { t } = useTranslation();

  const handleDemoLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      // Persist chosen role so AuthContext can apply it upon successful session setup
      await AsyncStorage.setItem("@selected_role", selectedRole);

      // Use target demo credentials
      const demoEmail = selectedRole === "admin" ? "Owner@gmail.com" : "prrrranv@gmail.com";
      const demoPassword = selectedRole === "admin" ? "Owner123" : "Pranav@00";
      const result = await signIn(demoEmail, demoPassword);
      if (result?.error) setError(result.error);
    } catch (e) {
      setError("Failed to authenticate with demo account.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = async () => {
    try {
      // Make sure the role is saved to AsyncStorage right before launching the OAuth sheets
      await AsyncStorage.setItem("@selected_role", selectedRole);
    } catch (e) {
      console.warn("Error setting role storage:", e);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      className="flex-1 bg-surface-bg"
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top }} 
        className="px-6" 
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center py-8">
          
          {/* Stunning Minimalist Header */}
          <View className="mb-8 items-center mt-10">
            <Text className="text-[#18181B] text-6xl font-black tracking-tighter text-center mt-4">
              Host
            </Text>
            <Text className="text-zinc-500 text-sm mt-4 font-semibold text-center px-8 leading-6">
              {selectedRole === "admin" 
                ? "Welcome to the premium PG Management System. Instantly register or sign in as an Owner using your Google account."
                : "Welcome to the premium PG Management System. Instantly register or sign in as a Tenant using your Google account."}
            </Text>
          </View>

          {/* Premium Role Switcher Selector */}
          <View className="bg-zinc-100 p-1.5 rounded-full flex-row mb-8 border border-zinc-200 self-center w-80">
            <TouchableOpacity 
              onPress={() => { setSelectedRole("admin"); setError(null); }}
              className={`flex-1 py-3.5 rounded-full items-center justify-center ${selectedRole === "admin" ? "bg-[#18181B]" : "bg-transparent"}`}
              activeOpacity={0.9}
            >
              <Text className={`text-xs font-black uppercase tracking-wider ${selectedRole === "admin" ? "text-white" : "text-zinc-400"}`}>
                PG Owner
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => { setSelectedRole("tenant"); setError(null); }}
              className={`flex-1 py-3.5 rounded-full items-center justify-center ${selectedRole === "tenant" ? "bg-[#18181B]" : "bg-transparent"}`}
              activeOpacity={0.9}
            >
              <Text className={`text-xs font-black uppercase tracking-wider ${selectedRole === "tenant" ? "text-white" : "text-zinc-400"}`}>
                Tenant
              </Text>
            </TouchableOpacity>
          </View>

          {/* Core Authenticator Card */}
          <View 
            className="bg-white p-8 rounded-[36px] border border-zinc-100 shadow-2xl" 
            style={{ 
              shadowColor: '#18181B', 
              shadowOffset: { width: 0, height: 12 }, 
              shadowOpacity: 0.04, 
              shadowRadius: 24, 
              elevation: 4 
            }}
          >
            {error && (
              <View 
                className="p-4 rounded-2xl mb-6" 
                style={{ 
                  backgroundColor: 'rgba(255, 51, 102, 0.06)', 
                  borderColor: 'rgba(255, 51, 102, 0.15)', 
                  borderWidth: 1.5 
                }}
              >
                <Text className="text-[#FF3366] text-xs font-black text-center">{error}</Text>
              </View>
            )}

            <Text className="text-[#18181B] text-base font-black uppercase tracking-wider mb-6 text-center">
              Connect Google Account
            </Text>

            {/* Reusable Premium Google Authentication Button */}
            <GoogleLoginButton onError={setError} onPress={handleGoogleClick} />

            {/* Subtle Divider for Demo Bypass */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-[1.5px]" style={{ backgroundColor: '#F4F4F5' }} />
              <Text className="text-zinc-400 text-[10px] font-black uppercase tracking-widest px-4">Or bypass login</Text>
              <View className="flex-1 h-[1.5px]" style={{ backgroundColor: '#F4F4F5' }} />
            </View>

            {/* Try Demo Button */}
            <TouchableOpacity 
              onPress={handleDemoLogin} 
              disabled={loading}
              className="h-16 rounded-full items-center justify-center border border-zinc-200 bg-zinc-50 active:opacity-85 flex-row" 
              activeOpacity={0.75}
            >
              {loading ? (
                <ActivityIndicator color="#18181B" />
              ) : (
                <Text className="text-[#18181B] text-sm font-black uppercase tracking-wider">
                  Try Demo {selectedRole === "admin" ? "Owner" : "Tenant"}
                </Text>
              )}
            </TouchableOpacity>

          </View>
        </View>

        <View style={{ paddingBottom: insets.bottom + 15 }}>
          <Text className="text-zinc-400 text-xs text-center font-bold uppercase tracking-widest">
            {t("platform_version")}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
