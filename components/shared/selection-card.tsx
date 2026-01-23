import { Text } from "@/components/ui/text";
import { Check, ChevronRight, LucideIcon } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import React from "react";
import { Pressable, View } from "react-native";

interface SelectionCardProps {
  title: string;
  description?: string;
  Icon: LucideIcon; // On passe directement le composant Lucide
  iconColor: string; // Utilisé pour l'icône principale (ex: #3b82f6)
  iconBgColor: string; // Classe Tailwind (ex: "bg-blue-500/10")
  isSelected: boolean;
  onSelect: () => void;
}

export const SelectionCard = ({
  title,
  description,
  Icon,
  iconColor,
  iconBgColor,
  isSelected,
  onSelect,
}: SelectionCardProps) => {
  const { colorScheme } = useColorScheme();

  // Couleurs de secours en dur pour les icônes de contrôle
  const checkColor = "#FFFFFF";
  const chevronColor = colorScheme === 'dark' ? '#4b5563' : '#d1d5db'; // gray-600 ou gray-300

  return (
    <Pressable
      onPress={onSelect}
      className={`relative overflow-hidden p-8 rounded-[32px] border-2 ${isSelected
        ? "bg-card border-primary shadow-md"
        : "bg-card/50 border-border/50 shadow-sm"
        }`}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <View
            className={`self-start p-3 rounded-2xl mb-4 ${isSelected ? iconBgColor : "bg-muted"
              }`}
          >
            {/* L'icône principale utilise la couleur passée en prop */}
            <Icon
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
          className={`w-8 h-8 rounded-full items-center justify-center ${isSelected ? "bg-primary" : "bg-muted/50"
            }`}
        >
          {isSelected ? (
            <Check size={20} color={checkColor} />
          ) : (
            <ChevronRight
              size={20}
              color={chevronColor}
            />
          )}
        </View>
      </View>
    </Pressable>
  );
};