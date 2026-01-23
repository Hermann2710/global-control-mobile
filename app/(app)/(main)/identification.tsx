import NumeroLotForm from "@/components/main/numlot/numero-lot-form";
import BackButton from "@/components/shared/back-button";
import { DismissKeyboard } from "@/components/shared/dismiss-keyboard";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function IdentifiationScreen() {
  const { productType } = useLocalSearchParams<{ productType: string }>();

  return (
    <DismissKeyboard withSafeArea={false}>
      <BackButton />
      <View className="flex-1 justify-center">
        {productType && <NumeroLotForm productType={productType} />}
      </View>
    </DismissKeyboard>
  );
}
