import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/contexts/auth-context";
import { getCurrentNeighborhood } from "@/lib/location";
import { loginSchema, LoginSchemaType } from "@/schemas/auth-schema";

const LoginForm = () => {
  const { width } = useWindowDimensions();
  const { signIn, isLoading } = useAuth();

  const isSmallDevice = width < 360;

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
      <View className="gap-8 w-full">
        <View className="gap-6 sm:gap-8">
          <FormInput
            name="email"
            label="Votre email"
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            className={isSmallDevice ? "h-12" : "h-14 sm:h-16"}
          />

          <View>
            <FormInput
              name="password"
              label="Votre mot de passe"
              placeholder="Mot de passe"
              secureTextEntry
              className={isSmallDevice ? "h-12" : "h-14 sm:h-16"}
            />
            <View className="items-end mt-8">
              <Link href="/auth/forgot-password" asChild>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text className="text-primary text-sm sm:text-base font-semibold">
                    Mot de passe oublié ?
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>

        <View className="mt-2 sm:mt-4">
          <Button
            onPress={form.handleSubmit(onSubmit)}
            className={`rounded-2xl shadow-sm ${isSmallDevice ? "h-12" : "h-14 sm:h-16"}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-primary-foreground font-bold text-lg">
                Se connecter
              </Text>
            )}
          </Button>

          {/* <View className="flex-row justify-center items-center mt-6">
            <Text className="text-muted-foreground text-sm sm:text-base">
              Pas encore de compte ?{" "}
            </Text>
            <Link href="/auth/register" asChild>
              <TouchableOpacity>
                <Text className="text-primary font-bold text-sm sm:text-base">
                  S'inscrire
                </Text>
              </TouchableOpacity>
            </Link>
          </View> */}
        </View>
      </View>
    </FormProvider>
  );
};

export default LoginForm;
