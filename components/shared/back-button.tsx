import { Button } from "@/components/ui/button";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

interface BackButtonProps {
    className?: string;
}

const BackButton = ({ className }: BackButtonProps) => {
    const router = useRouter();

    return (
        <View className={`self-start ${className}`}>
            <Button
                variant="default"
                size="icon"
                className="h-10 w-10 rounded-full active:bg-secondary/20"
                onPress={() => router.back()}
            >
                <FontAwesome name="chevron-left" size={18} color="white" />
            </Button>
        </View>
    );
};

export default BackButton;