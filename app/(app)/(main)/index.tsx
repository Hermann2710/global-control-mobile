import { SelectionCard } from "@/components/shared/selection-card";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/contexts/auth-context";
import { router } from "expo-router";
import React, { useState } from "react";
import { View, useWindowDimensions } from "react-native";

const MainScreen = () => {
  const { user } = useAuth();
  const [selected, setSelected] = useState<"cacao" | "cafe" | null>(null);
  const { width, height } = useWindowDimensions();

  const isLargeScreen = width > 768;
  const headerMargin = height < 700 ? "mb-6" : "mb-12";

  const handleNavigate = () => {
    router.push({
      pathname: "/(app)/(main)/identification",
      params: {
        productType: selected,
      },
    });
  };

  return (
    <>
      <View className={`${headerMargin}`}>
        <Text className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
          Bonjour 👋 {user?.lastName}
        </Text>
        <Text className="text-muted-foreground text-base sm:text-xl mt-2">
          Sur quoi voulez-vous travailler aujourd&apos;hui ?
        </Text>
      </View>

      <View
        className={`gap-8 sm:gap-10 ${isLargeScreen ? "flex-row" : "flex-col"}`}
      >
        <View className={isLargeScreen ? "flex-1" : "w-full"}>
          <SelectionCard
            title="Cacao"
            iconName="leaf"
            iconColor="#d97706"
            iconBgColor="bg-amber-500/20"
            isSelected={selected === "cacao"}
            onSelect={() => setSelected("cacao")}
          />
        </View>

        <View className={isLargeScreen ? "flex-1" : "w-full"}>
          <SelectionCard
            title="Café"
            iconName="coffee-outline"
            iconColor="#9a3412"
            iconBgColor="bg-orange-500/20"
            isSelected={selected === "cafe"}
            onSelect={() => setSelected("cafe")}
          />
        </View>
      </View>

      {/* Bouton fixe en bas */}
      {selected && (
        <View
          className="absolute bottom-10 left-0 right-0 items-center"
        >
          <Button
            className="w-full max-w-md h-14 sm:h-20 rounded-2xl shadow-lg shadow-primary/30"
            onPress={handleNavigate}
          >
            <Text className="text-primary-foreground font-bold text-lg sm:text-2xl italic">
              Continuer
            </Text>
          </Button>
        </View>
      )}
    </>
  );
};

export default MainScreen;
