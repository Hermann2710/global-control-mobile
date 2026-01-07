import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const FloatingIcon = ({
  name,
  size,
  top,
  left,
  right,
  bottom,
  delay = 0,
  duration = 3000,
  library = "fa",
}: any) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-20, { duration }),
          withTiming(20, { duration })
        ),
        -1,
        true
      )
    );
  }, [delay, duration, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const IconComponent =
    library === "fa" ? FontAwesome5 : MaterialCommunityIcons;

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top,
          left,
          right,
          bottom,
          opacity: 0.07,
          zIndex: -1,
        },
        animatedStyle,
      ]}
    >
      <IconComponent name={name} size={size} color="#6F4E37" />
    </Animated.View>
  );
};

export const CoffeeBackground = () => {
  return (
    <View
      className="absolute inset-0"
      style={{ pointerEvents: "none", zIndex: -1 }}
    >
      <FloatingIcon
        name="coffee"
        size={70}
        top="8%"
        left="-5%"
        delay={0}
        duration={4500}
      />
      <FloatingIcon
        name="mug-hot"
        size={85}
        bottom="12%"
        left="8%"
        delay={1200}
        duration={5000}
      />

      <FloatingIcon
        library="mci"
        name="candycane"
        size={60}
        top="22%"
        right="10%"
        delay={800}
        duration={3800}
      />
      <FloatingIcon
        library="fa"
        name="cookie-bite"
        size={50}
        bottom="28%"
        right="5%"
        delay={400}
        duration={3200}
      />

      <FloatingIcon
        name="seedling"
        size={45}
        top="45%"
        left="12%"
        delay={1500}
        duration={4800}
      />
      <FloatingIcon
        library="mci"
        name="leaf"
        size={40}
        top="65%"
        right="15%"
        delay={2000}
        duration={4200}
      />
    </View>
  );
};
