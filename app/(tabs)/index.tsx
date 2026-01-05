import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/contexts/auth-context";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const { signOut } = useAuth();
  return (
    <SafeAreaView className="flex-1 justify-center items-center p-4">
      <Text>Home</Text>
      <Button onPress={signOut}>
        <Text>Se déconnecter</Text>
      </Button>
    </SafeAreaView>
  );
};

export default Home;
