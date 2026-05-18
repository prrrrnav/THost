import React from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardScreen from "@/screens/admin/DashboardScreen";
import TenantsScreen from "@/screens/admin/TenantsScreen";
import PaymentsScreen from "@/screens/admin/PaymentsScreen";
import ExpensesScreen from "@/screens/admin/ExpensesScreen";
import ProfileScreen from "@/screens/admin/ProfileScreen";
import { Home, Users, Wallet, ReceiptText, User } from "@/lib/icons";

const Tab = createBottomTabNavigator();

export default function AdminNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let IconComponent;
          if (route.name === "Home") {
            IconComponent = Home;
          } else if (route.name === "Tenants") {
            IconComponent = Users;
          } else if (route.name === "Payments") {
            IconComponent = Wallet;
          } else if (route.name === "Expenses") {
            IconComponent = ReceiptText;
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
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Tenants" component={TenantsScreen} />
      <Tab.Screen name="Payments" component={PaymentsScreen} />
      <Tab.Screen name="Expenses" component={ExpensesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}