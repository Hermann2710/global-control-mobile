import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VerifyOtpData, verifyOtpSchema } from "@/schemas/auth-schema";
import Toast from "react-native-toast-message";
import { FormOTP } from "../shared/form-otp";

interface VerifyOtpFormProps {
  email: string;
}

const VerifyOtpForm = ({ email }: VerifyOtpFormProps) => {
  const form = useForm<VerifyOtpData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email: email,
      otp: "",
    },
  });

  const onSubmit = async (data: VerifyOtpData) => {
    try {
      // Appel à ton service API (ex: AuthService.verifyOtp(data))
      // Si succès :
      Toast.show({ type: "success", text1: "Code vérifié !" });
      router.push("/auth/reset-password");
    } catch (error) {
      Toast.show({ type: "error", text1: "Code invalide" });
    }
  };

  return (
    <FormProvider {...form}>
      <View className="mt-8 gap-8 w-full">
        {/* Remplacement ici */}
        <FormOTP name="otp" label="Code de vérification" />

        <Button className="mt-4" onPress={form.handleSubmit(onSubmit)}>
          <Text className="text-primary-foreground font-semibold">
            Vérifier le code
          </Text>
        </Button>

        <Button variant="ghost" onPress={() => router.back()}>
          <Text className="text-muted-foreground">Renvoyer un code</Text>
        </Button>
      </View>
    </FormProvider>
  );
};
export default VerifyOtpForm;
