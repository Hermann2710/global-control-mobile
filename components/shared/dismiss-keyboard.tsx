import { Keyboard, TouchableWithoutFeedback, View } from "react-native";

export const DismissKeyboard = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={{ flex: 1 }}>{children}</View>
  </TouchableWithoutFeedback>
);
