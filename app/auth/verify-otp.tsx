import { useLocalSearchParams } from "expo-router";
import React from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AuthLogo from "@/components/auth/logo";
import VerifyOtpForm from "@/components/auth/verify-otp-form";
import { Text } from "@/components/ui/text";

const VerifyOtpScreen = () => {
  const { email } = useLocalSearchParams<{ email: string }>();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 justify-center items-center px-6">
          <AuthLogo width={120} height={120} />

          <View className="mt-10 w-full">
            <Text className="text-2xl font-semibold text-primary text-center">
              Vérification
            </Text>
            <Text className="mt-4 text-center text-muted-foreground text-lg">
              Saisissez le code envoyé à {"\n"}
              <Text className="font-bold text-foreground">
                {email || "votre email"}
              </Text>
            </Text>

            <VerifyOtpForm email={email ?? ""} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default VerifyOtpScreen;
