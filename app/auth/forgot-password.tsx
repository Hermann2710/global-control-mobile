import React from "react";
import { View, useWindowDimensions } from "react-native";

import ForgotPasswordForm from "@/components/auth/forgot-password-form";
import AuthLogo from "@/components/auth/logo";
import { CoffeeBackground } from "@/components/shared/coffe-background";
import { DismissKeyboard } from "@/components/shared/dismiss-keyboard";
import { Text } from "@/components/ui/text";

const ForgotPasswordScreen = () => {
  const { width } = useWindowDimensions();
  const isSmallDevice = width < 360;

  return (
    <DismissKeyboard>
      <CoffeeBackground />
      <View className="flex-1 justify-center items-center px-6 py-10 sm:px-12">
        <AuthLogo scale={isSmallDevice ? 0.3 : 0.4} />

        <View className="mt-10 w-full max-w-md">
          <Text className="text-2xl sm:text-4xl font-bold text-primary text-center tracking-tight">
            Mot de passe oublié ?
          </Text>

          <Text className="mt-3 text-center text-muted-foreground text-sm sm:text-lg leading-6 px-2">
            Entrez votre adresse email pour recevoir un lien de
            réinitialisation.
          </Text>

          <View className="mt-10 sm:mt-14">
            <ForgotPasswordForm />
          </View>
        </View>
      </View>
    </DismissKeyboard>
  );
};

export default ForgotPasswordScreen;
