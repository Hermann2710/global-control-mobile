import { FontAwesome } from "@expo/vector-icons";
import { Image, Pressable, View } from "react-native";

export const PhotoItem = ({ uri, onRemove }: { uri: string; onRemove: () => void }) => {
    return (
        <View className="w-[30%] aspect-square relative">
            <Image source={{ uri }} className="w-full h-full rounded-2xl bg-secondary" />
            <Pressable
                onPress={onRemove}
                className="absolute -top-2 -right-2 bg-destructive rounded-full w-6 h-6 items-center justify-center shadow-sm z-10"
            >
                <FontAwesome name="times" size={12} color="white" />
            </Pressable>
        </View>
    );
};