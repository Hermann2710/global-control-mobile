import HeaderBar from "@/components/main/header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  role: string;
}

const RAW_USER: UserProfile = {
  name: "Alexandre Dev",
  email: "alex.dev@nativewind.io",
  avatar: "https://i.pravatar.cc/150?u=shadcn",
  role: "Pro Member",
};

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { signOut, isLoading } = useAuth();
  return (
    <DrawerContentScrollView
      {...props}
      className="bg-background"
      contentContainerStyle={{ flex: 1 }}
    >
      <View className="p-6 bg-primary items-center border-b border-border">
        <Image
          source={{ uri: RAW_USER.avatar }}
          className="w-20 h-20 rounded-full border-2 border-white/20"
        />
        <Text className="text-primary-foreground text-lg font-bold mt-3">
          {RAW_USER.name}
        </Text>
        <Text className="text-primary-foreground/70 text-xs">
          {RAW_USER.email}
        </Text>
      </View>

      <View className="flex-1 pt-4">
        <DrawerItemList {...props} />
      </View>

      <View className="pt-4 border-t border-border">
        <Button onPress={signOut} variant="destructive" className="w-full">
          {isLoading ? (
            <ActivityIndicator className="text-primary-foreground" />
          ) : (
            <Text className="text-primary-foreground">Déconnexion</Text>
          )}
        </Button>
      </View>
    </DrawerContentScrollView>
  );
}

export default function Layout() {
  return (
    <Drawer
      screenOptions={{
        header: (props) => <HeaderBar {...props} />,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    />
  );
}
