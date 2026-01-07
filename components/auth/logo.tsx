import { Image } from "expo-image";
import React from "react";
import { useWindowDimensions } from "react-native";

export default function AuthLogo({ scale = 0.6 }: { scale?: number }) {
  const { width: windowWidth } = useWindowDimensions();

  const size = windowWidth * scale;

  return (
    <Image
      source={require("@/assets/logos/logoIcon.svg")}
      style={{ width: size, height: size }}
      contentFit="contain"
      transition={500}
    />
  );
}
