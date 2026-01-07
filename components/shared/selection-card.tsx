import { Text } from "@/components/ui/text";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, View } from "react-native";

interface SelectionCardProps {
  title: string;
  description?: string;
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor: string;
  iconBgColor: string;
  isSelected: boolean;
  onSelect: () => void;
}

export const SelectionCard = ({
  title,
  description,
  iconName,
  iconColor,
  iconBgColor,
  isSelected,
  onSelect,
}: SelectionCardProps) => {
  return (
    <Pressable
      onPress={onSelect}
      className={`relative overflow-hidden p-8 rounded-[32px] border-2 transition-all ${
        isSelected
          ? "bg-card border-primary shadow-md"
          : "bg-card/50 border-transparent shadow-sm"
      }`}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <View
            className={`self-start p-3 rounded-2xl mb-4 ${
              isSelected ? iconBgColor : "bg-muted"
            }`}
          >
            <MaterialCommunityIcons
              name={iconName}
              size={28}
              color={iconColor}
            />
          </View>
          <Text className="text-2xl font-bold text-foreground">{title}</Text>
          {description && (
            <Text className="text-muted-foreground mt-1">{description}</Text>
          )}
        </View>

        <View
          className={`w-8 h-8 rounded-full items-center justify-center ${
            isSelected ? "bg-primary" : "bg-muted/50"
          }`}
        >
          {isSelected ? (
            <MaterialCommunityIcons name="check" size={20} color="white" />
          ) : (
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              className="opacity-30"
            />
          )}
        </View>
      </View>
    </Pressable>
  );
};
