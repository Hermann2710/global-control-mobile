import { pickImageFromCamera } from "@/lib/image-picker";
import { Controller, useFormContext } from "react-hook-form";
import { Image, Pressable, View } from "react-native";
import { Text } from "./text";

type Props = {
  name: string;
  label?: string;
  saveToGallery?: boolean;
};

export function ImagePickerField({
  name,
  label,
  saveToGallery = false,
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState }) => (
        <View className="gap-2">
          {label && (
            <Text className="text-sm font-medium text-gray-200">{label}</Text>
          )}

          <Pressable
            onPress={async () => {
              const uri = await pickImageFromCamera(saveToGallery);
              if (uri) onChange(uri);
            }}
            className="bg-blue-600 py-3 rounded-lg items-center active:opacity-80"
          >
            <Text className="text-white font-semibold">Prendre une photo</Text>
          </Pressable>

          {value && typeof value === "string" && (
            <Image
              source={{ uri: value }}
              className="w-28 h-28 rounded-full self-center mt-2"
            />
          )}

          {fieldState.error && (
            <Text className="text-red-500 text-xs">
              {fieldState.error.message}
            </Text>
          )}
        </View>
      )}
    />
  );
}
