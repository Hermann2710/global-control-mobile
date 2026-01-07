import NumeroLotForm from "@/components/main/numlot/numero-lot-form";
import CircleBackground from "@/components/shared/circle-background";
import { DismissKeyboard } from "@/components/shared/dismiss-keyboard";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NumeroLotScreen() {
  const { productType } = useLocalSearchParams<{ productType: string }>();

  return (
    <DismissKeyboard withSafeArea={false}>
      <CircleBackground>
        <SafeAreaView className="flex-1">
          <View className="flex-1 justify-center">
            {productType && <NumeroLotForm productType={productType} />}
          </View>
        </SafeAreaView>
      </CircleBackground>
    </DismissKeyboard>
  );
}
