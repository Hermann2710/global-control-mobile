import React from "react";
import { View, useWindowDimensions } from "react-native";

import LoginForm from "@/components/auth/login-form";
import AuthLogo from "@/components/auth/logo";
import { CoffeeBackground } from "@/components/shared/coffe-background";
import { DismissKeyboard } from "@/components/shared/dismiss-keyboard";
import { Text } from "@/components/ui/text";

const LoginScreen = () => {
  const { width } = useWindowDimensions();
  const isSmallDevice = width < 360;

  return (
    <DismissKeyboard>
      <CoffeeBackground />
      <View className="flex-1 justify-center items-center px-6 py-10 sm:px-12">
        <AuthLogo scale={isSmallDevice ? 0.3 : 0.4} />

        <View className="mt-8 w-full max-w-md">
          <Text className="text-2xl sm:text-4xl font-bold text-primary text-center tracking-tight">
            Se connecter
          </Text>

          <Text className="mt-2 text-center text-muted-foreground text-sm sm:text-lg leading-6">
            Veuillez vous connecter pour continuer à utiliser l'application
          </Text>

          <View className="mt-8 sm:mt-12">
            <LoginForm />
          </View>
        </View>
      </View>
    </DismissKeyboard>
  );
};

export default LoginScreen;
