// App.tsx
import "./global.css";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/context/AuthContext";
import { LocalizationProvider } from "@/context/LocalizationContext";
import RootNavigator from "@/navigation/RootNavigator";
import { navigationRef } from "@/navigation/navigationService";

export default function App() {
  return (
    <SafeAreaProvider>
      <LocalizationProvider>
        <AuthProvider>
          <NavigationContainer ref={navigationRef}>
            <StatusBar style="dark" backgroundColor="#F8F7F2" />
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </LocalizationProvider>
    </SafeAreaProvider>
  );
}
