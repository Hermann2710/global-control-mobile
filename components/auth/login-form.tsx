import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/contexts/auth-context";
import { getCurrentNeighborhood } from "@/lib/location";
import { loginSchema, LoginSchemaType } from "@/schemas/auth-schema";

const LoginForm = () => {
  const { signIn } = useAuth();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      location: "",
    },
  });

  useEffect(() => {
    async function fetchLocation() {
      const position = await getCurrentNeighborhood();
      if (position) {
        form.setValue("location", position);
      }
    }
    fetchLocation();
  }, []);

  const onSubmit = async (data: LoginSchemaType) => {
    await signIn(data);
  };

  return (
    <FormProvider {...form}>
      <View className="mt-8 gap-4 w-full">
        <FormInput
          name="email"
          label="Votre email"
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View>
          <FormInput
            name="password"
            label="Votre mot de passe"
            placeholder="Mot de passe"
            secureTextEntry
          />
          <View className="items-end mt-4">
            <Link href="/auth/forgot-password" asChild>
              <TouchableOpacity>
                <Text className="text-primary text-sm font-medium">
                  Mot de passe oublié ?
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        <Button onPress={form.handleSubmit(onSubmit)}>
          <Text className="text-primary-foreground font-semibold">
            Se connecter
          </Text>
        </Button>
      </View>
    </FormProvider>
  );
};

export default LoginForm;
