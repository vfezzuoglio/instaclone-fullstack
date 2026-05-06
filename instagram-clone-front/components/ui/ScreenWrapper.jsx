import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView, Platform, View } from "react-native";

export default function ScreenWrapper({ children, padded = true }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={{
            flex: 1,
            paddingHorizontal: padded ? 16 : 0,
            paddingVertical: padded ? 12 : 0,
          }}
        >
          {children}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}