import CircleBackground from "@/components/shared/circle-background";
import { Stack } from "expo-router";

const MainLayout = () => {

  return (

    <CircleBackground className="p-6">
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
          animation: "none",
        }}
      />
    </CircleBackground>
  );
};

export default MainLayout;