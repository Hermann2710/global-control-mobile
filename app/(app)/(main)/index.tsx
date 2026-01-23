import { SelectionCard } from "@/components/shared/selection-card";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/contexts/auth-context";
import { router } from "expo-router";
import { Bean, Coffee } from "lucide-react-native"; // Remplacé Material par Lucide
import React, { useState } from "react";
import { View, useWindowDimensions } from "react-native";

const MainScreen = () => {
  const { user } = useAuth();
  const [selected, setSelected] = useState<"cacao" | "cafe" | null>(null);
  const { width, height } = useWindowDimensions();

  const isLargeScreen = width > 768;
  const headerMargin = height < 700 ? "mb-6" : "mb-12";

  const handleNavigate = () => {
    if (!selected) return;
    router.push({
      pathname: "/(app)/(main)/identification",
      params: {
        productType: selected,
      },
    });
  };

  return (
    <View className="flex-1 px-4">
      <View className={`${headerMargin}`}>
        <Text className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
          Bonjour 👋 {user?.lastName}
        </Text>
        <Text className="text-muted-foreground text-base sm:text-xl mt-2">
          Sur quoi voulez-vous travailler aujourd&apos;hui ?
        </Text>
      </View>

      <View
        className={`gap-6 sm:gap-10 ${isLargeScreen ? "flex-row" : "flex-col"}`}
      >
        <View className={isLargeScreen ? "flex-1" : "w-full"}>
          <SelectionCard
            title="Cacao"
            description="Lancer un contrôle qualité cacao"
            Icon={Bean} // On passe le composant directement
            iconColor="#d97706" // Ambre
            iconBgColor="bg-amber-500/10"
            isSelected={selected === "cacao"}
            onSelect={() => setSelected("cacao")}
          />
        </View>

        <View className={isLargeScreen ? "flex-1" : "w-full"}>
          <SelectionCard
            title="Café"
            description="Démarrer une analyse de café"
            Icon={Coffee}
            iconColor="#9a3412" // Orange brûlé / Marron
            iconBgColor="bg-orange-500/10"
            isSelected={selected === "cafe"}
            onSelect={() => setSelected("cafe")}
          />
        </View>
      </View>

      {/* Bouton de validation */}
      {selected && (
        <View
          className="absolute bottom-10 left-4 right-4 items-center"
        >
          <Button
            className="w-full max-w-md h-16 rounded-3xl shadow-xl bg-primary"
            onPress={handleNavigate}
          >
            <Text className="text-primary-foreground font-bold text-xl uppercase tracking-widest">
              Suivant
            </Text>
          </Button>
        </View>
      )}
    </View>
  );
};

export default MainScreen;