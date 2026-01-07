import { FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { View, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import AuthLogo from "@/components/auth/logo";
import { CoffeeBackground } from "@/components/shared/coffe-background";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/contexts/auth-context";

const FloatingIcon = ({
  name,
  size,
  top,
  left,
  right,
  bottom,
  delay = 0,
  duration = 3000,
}: any) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-15, { duration }),
          withTiming(15, { duration })
        ),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top,
          left,
          right,
          bottom,
          opacity: 0.08,
          zIndex: -1,
        },
        animatedStyle,
      ]}
    >
      <FontAwesome5 name={name} size={size} color="#6F4E37" />
    </Animated.View>
  );
};

export default function App() {
  const { completeOnboarding } = useAuth();
  const { width } = useWindowDimensions();
  const isSmall = width < 360;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <CoffeeBackground />

      <View className="flex-1 justify-center items-center px-6">
        <AuthLogo />

        <View className="w-full max-w-sm mt-8">
          <Text className="text-xl sm:text-4xl text-foreground font-bold text-center leading-tight">
            Bienvenue sur{"\n"}
            <Text className="text-xl sm:text-4xl text-primary font-bold text-center leading-tight">
              Global Control
            </Text>
          </Text>

          <Text className="mt-4 text-center text-muted-foreground text-base sm:text-xl">
            Gérez vos appareils IoT en toute simplicité, où que vous soyez.
          </Text>
        </View>

        <View className="w-full max-w-sm mt-12">
          <Button
            onPress={completeOnboarding}
            size="lg"
            className={`w-full shadow-md rounded-2xl ${isSmall ? "h-12" : "h-16"}`}
          >
            <Text className="text-primary-foreground font-bold text-lg">
              Commencer
            </Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
