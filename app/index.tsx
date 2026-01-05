import AuthLogo from "@/components/auth/logo";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { router } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center items-center px-6">
        <AuthLogo />

        <View className="w-full max-w-sm mt-8">
          <Text className="text-3xl text-foreground font-bold text-center leading-tight">
            Bienvenue sur{"\n"}
            <Text className="text-3xl text-primary font-bold text-center leading-tight">
              Global Control Mobile
            </Text>
          </Text>

          <Text className="mt-4 text-center text-muted-foreground text-lg">
            Gérez vos appareils IoT en toute simplicité, où que vous soyez.
          </Text>
        </View>

        <View className="w-full max-w-sm mt-10">
          <Button
            onPress={() => router.push("/auth/login")}
            size="lg"
            className="w-full shadow-sm"
          >
            <Text className="text-primary-foreground font-semibold">
              Commencer
            </Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
