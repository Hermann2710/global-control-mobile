import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/contexts/auth-context";
import {
  ForgotPasswordData,
  forgotPasswordSchema,
} from "@/schemas/auth-schema";

const ForgotPasswordForm = () => {
  const { sendOtp } = useAuth();
  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    await sendOtp(data);
  };

  return (
    <FormProvider {...form}>
      <View className="mt-8 gap-4 w-full">
        <FormInput
          name="email"
          label="Email de récupération"
          placeholder="votre@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />

        <Button className="mt-2" onPress={form.handleSubmit(onSubmit)}>
          <Text className="text-primary-foreground font-semibold">
            Envoyer le lien
          </Text>
        </Button>

        <Button variant="ghost" onPress={() => router.back()}>
          <Text className="text-muted-foreground">Retour à la connexion</Text>
        </Button>
      </View>
    </FormProvider>
  );
};

export default ForgotPasswordForm;
