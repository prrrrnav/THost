// src/navigation/TenantNavigator.tsx
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import TenantSetupScreen from "@/screens/tenant/TenantSetupScreen";
import TenantHomeScreen from "@/screens/tenant/TenantHomeScreen";
import TenantComplaintsScreen from "@/screens/tenant/TenantComplaintsScreen";
import TenantFeedbackScreen from "@/screens/tenant/TenantFeedbackScreen";
import TenantProfileScreen from "@/screens/tenant/TenantProfileScreen";
import { Home, Wrench, Heart, User } from "@/lib/icons";

const Tab = createBottomTabNavigator();

function TenantTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let IconComponent;
          if (route.name === "Home") {
            IconComponent = Home;
          } else if (route.name === "Complaints") {
            IconComponent = Wrench;
          } else if (route.name === "Feedback") {
            IconComponent = Heart;
          } else if (route.name === "Profile") {
            IconComponent = User;
          }
          return <IconComponent size={22} color={color} strokeWidth={focused ? 2.5 : 2} />;
        },
        tabBarActiveTintColor: "#1C1C1C",
        tabBarInactiveTintColor: "#A1A1AA",
        tabBarStyle: {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          height: Platform.OS === "ios" ? 86 : 64,
          paddingBottom: Platform.OS === "ios" ? 28 : 10,
          paddingTop: 8,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.05,
          shadowRadius: 12,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "bold",
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen name="Home" component={TenantHomeScreen} />
      <Tab.Screen name="Complaints" component={TenantComplaintsScreen} />
      <Tab.Screen name="Feedback" component={TenantFeedbackScreen} />
      <Tab.Screen name="Profile" component={TenantProfileScreen} />
    </Tab.Navigator>
  );
}

export default function TenantNavigator() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) {
      setLoading(false);
      return;
    }

    const checkConnection = async () => {
      try {
        const { data, error } = await supabase
          .from("tenants")
          .select("pg_id")
          .eq("id", userId)
          .maybeSingle();

        if (data?.pg_id) {
          setIsConnected(true);
        } else {
          setIsConnected(false);
        }
      } catch (e) {
        console.log("Error checking tenant connection status:", e);
      } finally {
        setLoading(false);
      }
    };

    checkConnection();

    // Subscribe to real-time updates on the tenants record for this specific user
    const channel = supabase
      .channel(`tenant_channel_${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tenants",
          filter: `id=eq.${userId}`
        },
        (payload: any) => {
          if (payload.new && payload.new.pg_id) {
            setIsConnected(true);
          } else {
            setIsConnected(false);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  if (loading) {
    return (
      <View className="flex-1 bg-surface-bg items-center justify-center">
        <ActivityIndicator size="large" color="#18181B" />
      </View>
    );
  }

  return isConnected ? <TenantTabNavigator /> : <TenantSetupScreen />;
}
