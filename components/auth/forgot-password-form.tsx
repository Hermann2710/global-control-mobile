import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ActivityIndicator, View, useWindowDimensions } from "react-native";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/contexts/auth-context";
import {
  ForgotPasswordData,
  forgotPasswordSchema,
} from "@/schemas/auth-schema";

const ForgotPasswordForm = () => {
  const { width } = useWindowDimensions();
  const { sendOtp, isLoading } = useAuth();

  const isSmallDevice = width < 360;

  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    await sendOtp(data);
  };

  return (
    <FormProvider {...form}>
      <View className="gap-8 w-full">
        <View className="gap-6">
          <FormInput
            name="email"
            label="Email"
            placeholder="votre@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            className={isSmallDevice ? "h-12" : "h-14 sm:h-16"}
          />
        </View>

        <View className="gap-4 sm:mt-4">
          <Button
            onPress={form.handleSubmit(onSubmit)}
            className={`rounded-2xl shadow-sm ${isSmallDevice ? "h-12" : "h-14 sm:h-16"}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-primary-foreground font-bold text-lg">
                Envoyer le lien
              </Text>
            )}
          </Button>

          <Button
            variant="ghost"
            onPress={() => router.push("/auth/login")}
            className={isSmallDevice ? "h-12" : "h-14"}
          >
            <Text className="text-muted-foreground font-medium text-base">
              Retour à la connexion
            </Text>
          </Button>
        </View>
      </View>
    </FormProvider>
  );
};

export default ForgotPasswordForm;
