import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import { View, ViewProps, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const AnimatedCircle = ({
  size,
  top,
  left,
  right,
  bottom,
  opacity,
  duration,
}: any) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration }),
        withTiming(0.9, { duration })
      ),
      -1,
      true
    );
  }, [duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      className="bg-primary"
      style={[
        {
          position: "absolute",
          width: size,
          height: size,
          top,
          left,
          right,
          bottom,
          borderRadius: 999,
          opacity: opacity,
          zIndex: -1,
        },
        animatedStyle,
      ]}
      pointerEvents="none"
    />
  );
};

const CircleBackground = ({ children, className, ...props }: ViewProps) => {
  const { height } = useWindowDimensions();

  if (height <= 600) return null;

  return (
    <View className={cn("flex-1 bg-primary/5", className)} {...props}>
      <View className="absolute inset-0" style={{ zIndex: -1 }}>
        {/* Haut Gauche */}
        <AnimatedCircle
          size={250}
          top={-100}
          left={-80}
          opacity={0.08}
          duration={4000}
        />

        {/* Bas Droite */}
        <AnimatedCircle
          size={300}
          bottom={-120}
          right={-100}
          opacity={0.06}
          duration={5000}
        />

        {/* Milieu Droite */}
        <AnimatedCircle
          size={150}
          top="30%"
          right={-50}
          opacity={0.04}
          duration={3500}
        />

        {/* Milieu Gauche Bas */}
        <AnimatedCircle
          size={100}
          bottom="20%"
          left={-30}
          opacity={0.05}
          duration={4500}
        />
      </View>

      {children}
    </View>
  );
};

export default CircleBackground;
