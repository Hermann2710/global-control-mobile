import { AuthProvider, useAuth } from "@/contexts/auth-context";
import "../global.css";

import { UploadProvider } from "@/contexts/upload-context";
import { NAV_THEME } from "@/lib/theme";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { useColorScheme } from "react-native";
import Toast from "react-native-toast-message";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isLoading } = useAuth();
  const colorScheme = useColorScheme() ?? "light";

  React.useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  /* if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: NAV_THEME[colorScheme].colors.background,
        }}
      >
        <ActivityIndicator
          size="large"
          color={NAV_THEME[colorScheme].colors.primary}
        />
      </View>
    );
  } */

  return (
    <ThemeProvider value={NAV_THEME[colorScheme]}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false, animation: "none" }} />
      <PortalHost />
      <Toast position="bottom" />
    </ThemeProvider>
  );
}

export default function AppLayout() {
  return (
    <AuthProvider>
      <UploadProvider>
        <RootLayoutNav />
      </UploadProvider>
    </AuthProvider>
  );
}
