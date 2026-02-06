import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { FlatList, View } from "react-native";

import BackButton from "@/components/shared/back-button";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { constants } from "@/lib/constants";

export default function ChooseActionScreen() {
  const router = useRouter();
  const { numeroLot, produitType } = useLocalSearchParams<{
    numeroLot: string;
    produitType: string;
  }>();

  const category = constants.categories.find((c) => c.slug === produitType);

  const filteredActions = category?.actions.filter(
    (action) => {
      if (numeroLot) {
        return action.requireNumLot === true;
      }
      return action.requireNumLot === false;
    }
  );

  if (!category) return null;

  return (
    <View className="flex-1">
      <BackButton />
      <FlatList
        data={filteredActions}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerClassName="pb-12 px-4"
        columnWrapperClassName="gap-4"
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListHeaderComponent={
          <View className="mb-8">
            <Text className="text-3xl font-bold tracking-tight text-center uppercase text-primary">
              {category.title}
            </Text>
            <View className="self-center px-4 py-1 mt-2">
              <Text className="text-foreground font-medium text-sm text-center">
                {numeroLot ? `Lot : ${numeroLot}` : "Opérations générales"}
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View className="flex-1 border border-card rounded-lg">
            <Button
              variant="ghost"
              className="h-40 w-full p-0 border-none shadow-md bg-card overflow-hidden flex-col items-center justify-center gap-3 active:bg-secondary/20"
              onPress={() => {
                router.push({
                  pathname: `/(app)/(main)/(identification)/${item.type === "photo" ? "photo" : "form"}`,
                  params: {
                    numeroLot,
                    produitType,
                    operation: item.id
                  }
                })
              }}
            >
              <View className="bg-primary/10 p-4 rounded-2xl">
                <MaterialCommunityIcons
                  name={
                    (item.icon === "scale-balanced"
                      ? "scale-balance"
                      : item.icon) as any
                  }
                  size={32}
                  className="text-primary"
                />
              </View>

              <Text className="text-center font-bold text-[11px] px-1 uppercase tracking-tight text-card-foreground">
                {item.label}
              </Text>
            </Button>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-center text-muted-foreground mt-10">
            Aucune action disponible pour ce choix.
          </Text>
        }
      />
    </View>
  );
}