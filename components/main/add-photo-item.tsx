import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { Text } from "../ui/text";

export const AddPhotoButton = ({ onPress, isFullWidth }: { onPress: () => void; isFullWidth: boolean }) => {
    return (
        <Pressable
            onPress={onPress}
            className={`${isFullWidth ? "w-full h-48" : "w-[30%] aspect-square"
                } border-2 border-dashed border-muted rounded-2xl items-center justify-center bg-secondary/10 active:bg-secondary/20`}
        >
            <MaterialCommunityIcons
                name="camera-plus"
                size={isFullWidth ? 40 : 28}
                className="text-muted-foreground"
            />
            <Text className={`${isFullWidth ? "text-base" : "text-[10px]"} mt-1 font-medium text-muted-foreground uppercase`}>
                Ajouter
            </Text>
        </Pressable>
    );
};