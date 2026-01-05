import { Controller, useFormContext } from "react-hook-form";
import { View } from "react-native";
import { OTPInput } from "../ui/otp-input";
import { Text } from "../ui/text";

export function FormOTP({ name, label }: { name: string; label?: string }) {
  const { control } = useFormContext();

  return (
    <View className="gap-2 w-full items-center">
      {label && (
        <Text className="text-sm font-medium text-muted-foreground self-start ml-1 mb-2">
          {label}
        </Text>
      )}

      <Controller
        control={control}
        name={name}
        defaultValue={""}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View className="w-full">
            <OTPInput value={value ?? ""} onChange={onChange} error={!!error} />
            {error && (
              <Text className="text-destructive text-xs mt-2 ml-1 text-center">
                {error.message}
              </Text>
            )}
          </View>
        )}
      />
    </View>
  );
}
