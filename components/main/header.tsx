import { useIsOnline } from "@/hooks/use-is-online";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DrawerHeaderProps } from "@react-navigation/drawer";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeToggle } from "../shared/theme-picker";

const HeaderBar = ({ navigation, options }: DrawerHeaderProps) => {
  const insets = useSafeAreaInsets();
  const isOnline = useIsOnline();

  return (
    <View
      style={{ paddingTop: insets.top }}
      className="bg-background border-b border-border"
    >
      <View className="h-16 px-4 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          className="p-2 rounded-full active:bg-muted"
        >
          <MaterialCommunityIcons name="menu" size={28} color="#6F4E37" />
        </TouchableOpacity>

        {isOnline ? (
          <Text className="text-xl font-bold text-foreground">
            {options.title ?? "Global Control"}
          </Text>
        ) : (
          <View className="flex flex-row gap-2 items-center justify-center">
            <Text className="text-xl font-bold text-foreground">Connexion</Text>
            <ActivityIndicator />
          </View>
        )}

        <ThemeToggle />
      </View>
    </View>
  );
};

export default HeaderBar;
