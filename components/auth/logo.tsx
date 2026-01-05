import { Image } from "expo-image";
import React from "react";

export default function AuthLogo({
  width = 280,
  height = 280,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <Image
      source={require("@/assets/logos/logoIcon.svg")}
      style={{ width, height }}
      contentFit="contain"
      transition={500}
    />
  );
}
