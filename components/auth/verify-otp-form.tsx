import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ActivityIndicator, useWindowDimensions, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/contexts/auth-context";
import { verifyOtpSchema, VerifyOtptype } from "@/schemas/auth-schema";
import { FormOTP } from "../shared/form-otp";

interface VerifyOtpFormProps {
  email: string;
}

const VerifyOtpForm = ({ email }: VerifyOtpFormProps) => {
  const { width } = useWindowDimensions();
  const { isLoading, verifyOtp } = useAuth();

  const isSmallDevice = width < 360;

  const form = useForm<VerifyOtptype>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email: email,
      code: "",
    },
  });

  const handleSubmit = async (data: VerifyOtptype) => {
    await verifyOtp(data);
  };

  return (
    <FormProvider {...form}>
      <View className="gap-10 w-full">
        <View className="items-center justify-center">
          <FormOTP name="code" label="Code de vérification" />
        </View>

        <View className="gap-4 sm:mt-6">
          <Button
            onPress={form.handleSubmit(handleSubmit)}
            className={`rounded-2xl shadow-sm ${isSmallDevice ? "h-12" : "h-14 sm:h-16"}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-primary-foreground font-bold text-lg">
                Vérifier le code
              </Text>
            )}
          </Button>

          <Button
            variant="ghost"
            onPress={() => router.push("/auth/forgot-password")}
            className={isSmallDevice ? "h-12" : "h-14"}
          >
            <Text className="text-muted-foreground font-medium text-base">
              Renvoyer un code
            </Text>
          </Button>
        </View>
      </View>
    </FormProvider>
  );
};

export default VerifyOtpForm;
