import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { numeroLotSchema, NumeroLotType } from "@/schemas/lot-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";

export default function NumeroLotForm({
  productType,
}: {
  productType: string;
}) {
  const form = useForm<NumeroLotType>({
    resolver: zodResolver(numeroLotSchema),
    defaultValues: {
      numerotLot: "",
      produitType: productType as "cacao" | "cafe",
    },
  });

  const handleSubmit = (data: NumeroLotType) => {
    console.log("Form submitted:", data);
  };

  return (
    <FormProvider {...form}>
      <View className="px-8 w-full max-w-sm self-center">
        {/* En-tête du formulaire */}
        <View className="mb-10 items-center">
          <View className="bg-primary/10 px-4 py-1 rounded-full mb-4">
            <Text className="text-primary font-medium capitalize">
              Mode {productType}
            </Text>
          </View>
          <Text className="text-3xl font-bold text-foreground text-center">
            Numéro de lot
          </Text>
          <Text className="text-muted-foreground text-center mt-2 text-base">
            Veuillez entrer l'identifiant pour commencer le suivi.
          </Text>
        </View>

        {/* Champ de saisie */}
        <View className="mb-8">
          <FormInput
            name="numerotLot"
            label="ID du lot"
            placeholder="Ex: LOT-2026-X"
            className="h-14 text-lg"
          />
        </View>

        {/* Boutons */}
        <View className="gap-y-4">
          <Button
            onPress={form.handleSubmit(handleSubmit)}
            className="h-14 rounded-2xl shadow-sm"
          >
            <Text className="text-primary-foreground font-bold text-lg">
              Soumettre le lot
            </Text>
          </Button>

          <Button
            variant="link"
            onPress={() => router.push("/(app)/(main)/numero-lot")}
            className="h-10"
          >
            <Text className="text-muted-foreground font-medium">
              Ignorer cette étape
            </Text>
          </Button>
        </View>
      </View>
    </FormProvider>
  );
}
