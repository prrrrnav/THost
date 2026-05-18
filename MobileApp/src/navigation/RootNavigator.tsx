// src/navigation/RootNavigator.tsx
import React from "react";
import { View, ActivityIndicator } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "@/context/AuthContext";
import LoginScreen from "@/screens/LoginScreen";
import AdminNavigator from "@/navigation/AdminNavigator";
import TenantNavigator from "@/navigation/TenantNavigator";
import TenantDetailsScreen from "@/screens/admin/TenantDetailsScreen";
import PropertyDetailsScreen from "@/screens/admin/PropertyDetailsScreen";
import PropertySelectorScreen from "@/screens/admin/PropertySelectorScreen";
import ApprovalsScreen from "@/screens/admin/ApprovalsScreen";
import MenuScreen from "@/screens/admin/MenuScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 bg-[#0D0D0F] items-center justify-center">
        <ActivityIndicator color="#FC8019" size="large" />
      </View>
    );
  }

  const isAuthenticated = !!session;
  const isAdmin = profile?.role === "admin" || profile?.role === "superadmin";

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: "fade" }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : isAdmin ? (
        <>
          <Stack.Screen name="AdminApp" component={AdminNavigator} />
          <Stack.Screen name="TenantDetails" component={TenantDetailsScreen} />
          <Stack.Screen name="PropertyDetails" component={PropertyDetailsScreen} />
          <Stack.Screen name="PropertySelector" component={PropertySelectorScreen} />
          <Stack.Screen name="Approvals" component={ApprovalsScreen} />
          <Stack.Screen name="MenuPlanner" component={MenuScreen} />
        </>
      ) : (
        <Stack.Screen name="TenantApp" component={TenantNavigator} />
      )}
    </Stack.Navigator>
  );
}
