import { Text, TextInput, View } from "react-native";

export default function AppInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  autoCapitalize = "none",
  multiline = false,
}) {
  return (
    <View style={{ gap: 8 }}>
      {label ? (
        <Text style={{ fontSize: 14, fontWeight: "500", color: "#374151" }}>
          {label}
        </Text>
      ) : null}

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        style={{
          borderWidth: 1,
          borderColor: "#D1D5DB",
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: multiline ? 14 : 12,
          fontSize: 16,
          backgroundColor: "white",
          minHeight: multiline ? 100 : undefined,
          textAlignVertical: multiline ? "top" : "auto",
        }}
      />
    </View>
  );
}