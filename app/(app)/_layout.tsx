import HeaderBar from "@/components/main/header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { constants } from "@/lib/constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { user, signOut, isLoading } = useAuth();

  if (!user) return <></>

  return (
    <DrawerContentScrollView
      {...props}
      scrollEnabled={false}
      contentContainerStyle={{ flex: 1 }}
    >
      <View className="p-6 bg-primary/10 items-center border-b border-border mb-4 mx-4 rounded-2xl">
        <Image
          source={{
            uri: user.profileImage
              ? `${constants.api.uploadsUrl}${user.profileImage}`
              : 'https://via.placeholder.com/150'
          }}
          className="w-20 h-20 rounded-full border-2 border-primary"
        />
        <Text className="text-foreground text-lg font-bold mt-3" numberOfLines={1}>
          {user.firstName} {user.lastName}
        </Text>
        <Text className="text-muted-foreground text-xs" numberOfLines={1}>
          {user.email}
        </Text>
      </View>

      <View className="flex-1 px-2">
        <DrawerItemList {...props} />
      </View>

      <View className="p-4 border-t border-border">
        <Button
          onPress={signOut}
          variant="destructive"
          className="w-full h-12"
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <View className="flex-row items-center justify-center gap-2">
              <MaterialCommunityIcons name="logout" size={20} color="white" />
              <Text className="text-destructive-foreground font-bold">
                Déconnexion
              </Text>
            </View>
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
        drawerActiveBackgroundColor: "#E2E8F0",
        drawerActiveTintColor: "#41A745",
        drawerInactiveTintColor: "#64748B",
        drawerItemStyle: {
          borderRadius: 12,
          marginVertical: 4,
          paddingHorizontal: 8,
          marginHorizontal: 10,
        },
        drawerLabelStyle: {
          fontFamily: "System",
          fontWeight: "600",
          fontSize: 14,
          marginLeft: -10,
        },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="(main)"
        options={{
          title: "Tableau de bord",
          drawerLabel: "Accueil",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-variant-outline" size={size} color={color} />
          ),
        }}
      />


      <Drawer.Screen
        name="queue"
        options={{
          title: "Operations",
          drawerLabel: "Operations en Attente",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="file" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="profile"
        options={{
          title: "Mon Profil",
          drawerLabel: "Profil",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}