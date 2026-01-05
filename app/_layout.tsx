import { AuthProvider } from "@/contexts/auth-context";
import "../global.css";

import { NAV_THEME } from "@/lib/theme";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { useColorScheme } from "react-native";
import Toast from "react-native-toast-message";

export default function AppLayout() {
  const colorScheme = useColorScheme() ?? "light";

  return (
    <AuthProvider>
      <ThemeProvider value={NAV_THEME[colorScheme]}>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

        <Stack screenOptions={{ headerShown: false }} />
        <PortalHost />
        <Toast position="bottom" />
      </ThemeProvider>
    </AuthProvider>
  );
}
