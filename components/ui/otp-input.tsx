import { useColorScheme } from "nativewind";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  error?: boolean;
}

export function OTPInput({
  value = "",
  onChange,
  length = 6,
  error,
}: OTPInputProps) {
  const { colorScheme } = useColorScheme();
  const inputRef = useRef<TextInput>(null);
  const isDark = colorScheme === "dark";

  // Animation d'opacité pour le curseur
  const cursorOpacity = useRef(new Animated.Value(1)).current;

  const codeChars = Array.from({ length }, (_, i) => i);
  const safeValue = value || "";

  // Logique du clignotement
  useEffect(() => {
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );

    blink.start();
    return () => blink.stop();
  }, []);

  const colors = {
    background: isDark ? "#1C1F23" : "#F8F9FA",
    border: isDark ? "#333F55" : "#E5EAEF",
    primary: "#41A745",
    destructive: "#FA896B",
    text: isDark ? "#EAEFF4" : "#2A3547",
    placeholder: "#7C8FAC",
  };

  return (
    <Pressable
      onPress={() => inputRef.current?.focus()}
      className="flex-row justify-between w-full"
    >
      {codeChars.map((index) => {
        const char = safeValue[index];
        const isFocused = safeValue.length === index;
        const isActive = safeValue.length > index;

        return (
          <View
            key={index.toString()}
            style={[
              styles.box,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
              isFocused && { borderColor: colors.primary, borderWidth: 2 },
              isActive && { borderColor: colors.primary + "80" },
              error && { borderColor: colors.destructive },
            ]}
          >
            <Text style={[styles.text, { color: colors.text }]}>
              {char || ""}
            </Text>

            {isFocused && (
              <Animated.View
                style={[
                  styles.cursor,
                  {
                    backgroundColor: colors.primary,
                    opacity: cursorOpacity,
                  },
                ]}
              />
            )}
          </View>
        );
      })}

      <TextInput
        ref={inputRef}
        value={safeValue}
        onChangeText={(text) => {
          const numericValue = text.replace(/[^0-9]/g, "");
          onChange(numericValue.slice(0, length));
        }}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        maxLength={length}
        style={styles.hiddenInput}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  box: {
    width: 48,
    height: 56,
    borderWidth: 1.5,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
  cursor: {
    position: "absolute",
    bottom: 12,
    width: 20,
    height: 2,
    borderRadius: 99,
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    width: 1,
    height: 1,
  },
});
