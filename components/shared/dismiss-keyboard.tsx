import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface DismissKeyboardProps {
  children: React.ReactNode;
  withSafeArea?: boolean;
}

export const DismissKeyboard = ({
  children,
  withSafeArea = true,
}: DismissKeyboardProps) => {
  const content = (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View className="flex-1">{children}</View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  if (withSafeArea) {
    return <SafeAreaView className="flex-1">{content}</SafeAreaView>;
  }

  return <View className="flex-1">{content}</View>;
};
