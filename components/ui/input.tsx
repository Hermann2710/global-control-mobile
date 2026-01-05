import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Platform, TextInput, View, type TextInputProps } from "react-native";
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
  ...props
}: ComponentProps<typeof Input> & { name: string; label?: string }) {
  const { control } = useFormContext();

  return (
    <View className="gap-1.5 w-full">
      {label && (
        <Text className="text-sm font-medium text-muted-foreground ml-1">
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
            <Input
              {...props}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              className={cn(error && "border-destructive", props.className)}
            />
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
