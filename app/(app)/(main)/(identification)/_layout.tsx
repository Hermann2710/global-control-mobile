import { Stack } from "expo-router";
import React from "react";
import { View } from "react-native";

const IdentificationLayout = () => {
    return <View className="flex-1">
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "transparent" },
                animation: "none",
            }}
        />
    </View>;
};

export default IdentificationLayout;