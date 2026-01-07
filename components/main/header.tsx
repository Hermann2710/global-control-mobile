import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DrawerHeaderProps } from "@react-navigation/drawer";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HeaderBar = ({ navigation, options }: DrawerHeaderProps) => {
  const insets = useSafeAreaInsets();

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

        <Text className="text-xl font-bold text-foreground">
          {options.title ?? "Global Control"}
        </Text>

        <TouchableOpacity className="p-2">
          <MaterialCommunityIcons
            name="account-circle-outline"
            size={28}
            color="#6F4E37"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HeaderBar;
