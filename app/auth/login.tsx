import React from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import LoginForm from "@/components/auth/login-form";
import AuthLogo from "@/components/auth/logo";
import { DismissKeyboard } from "@/components/shared/dismiss-keyboard";
import { Text } from "@/components/ui/text";

const LoginScreen = () => {
  return (
    <DismissKeyboard>
      <SafeAreaView className="flex-1 bg-background">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 justify-center items-center px-6">
            <AuthLogo width={200} height={200} />

            <View className="mt-10 w-full">
              <Text className="text-2xl font-semibold text-primary text-center">
                Se connecter
              </Text>
              <Text className="mt-4 text-center text-muted-foreground text-lg">
                Veuillez vous connecter pour continuer à utiliser l'application
              </Text>

              <LoginForm />
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </DismissKeyboard>
  );
};

export default LoginScreen;
