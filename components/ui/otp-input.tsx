import React, { useRef } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

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
  const inputRef = useRef<TextInput>(null);

  const codeChars = Array.from({ length }, (_, i) => i);
  const safeValue = value || "";

  const handlePress = () => {
    inputRef.current?.focus();
  };

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      {codeChars.map((index) => {
        const char = safeValue[index];
        const isFocused = safeValue.length === index;
        const isActive = safeValue.length > index;

        return (
          <View
            key={index}
            style={[
              styles.box,
              isFocused && styles.boxFocused,
              isActive && styles.boxActive,
              error && styles.boxError,
            ]}
          >
            <Text style={styles.text}>{char || ""}</Text>

            {isFocused && <View style={styles.cursor} />}
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
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
  },
  boxFocused: {
    borderColor: "#000000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  boxActive: {
    borderColor: "#00000080",
  },
  boxError: {
    borderColor: "#ef4444",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
  },
  cursor: {
    position: "absolute",
    bottom: 12,
    width: 24,
    height: 2,
    backgroundColor: "#000000",
    borderRadius: 99,
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    width: 1,
    height: 1,
  },
});
