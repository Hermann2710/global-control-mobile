import { cn } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  Platform,
  TextInput,
  TouchableOpacity,
  View,
  type TextInputProps,
} from "react-native";
import { Text } from "./text";

function Input({
  className,
  ...props
}: TextInputProps & React.RefAttributes<TextInput>) {
  return (
    <TextInput
      className={cn(
        "dark:bg-input/30 border-input bg-background text-foreground flex h-10 w-full min-w-0 flex-row items-center rounded-md border px-3 py-1 text-base leading-5 shadow-sm shadow-black/5 sm:h-9",
        props.editable === false &&
          cn(
            "opacity-50",
            Platform.select({
              web: "disabled:pointer-events-none disabled:cursor-not-allowed",
            })
          ),
        Platform.select({
          web: cn(
            "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground outline-none transition-[color,box-shadow] md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
          ),
          native: "placeholder:text-muted-foreground/50",
        }),
        className
      )}
      {...props}
    />
  );
}

export { Input };

export function FormInput({
  name,
  label,
  secureTextEntry,
  ...props
}: React.ComponentProps<typeof Input> & { name: string; label?: string }) {
  const { control } = useFormContext();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPasswordInput = secureTextEntry;

  return (
    <View className="gap-2 w-full">
      {label && (
        <Text className="text-sm sm:text-lg font-medium text-muted-foreground ml-1">
          {label}
        </Text>
      )}

      <Controller
        control={control}
        name={name}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <View>
            <View className="relative justify-center">
              <Input
                {...props}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry={isPasswordInput && !isPasswordVisible}
                className={cn(
                  error && "border-destructive",
                  isPasswordInput && "pr-12",
                  props.className
                )}
              />

              {isPasswordInput && (
                <TouchableOpacity
                  className="absolute right-4 active:opacity-50"
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  <Ionicons
                    name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#6b7280"
                  />
                </TouchableOpacity>
              )}
            </View>

            {error && (
              <Text className="text-destructive text-xs mt-1 ml-1">
                {error.message}
              </Text>
            )}
          </View>
        )}
      />
    </View>
  );
}
