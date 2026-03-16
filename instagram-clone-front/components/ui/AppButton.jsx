import { Pressable, Text } from "react-native";

export default function AppButton({
  title,
  onPress,
  variant = "primary",
  style,
}) {
  const isPrimary = variant === "primary";

  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          paddingVertical: 14,
          paddingHorizontal: 16,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isPrimary ? "#111827" : "white",
          borderWidth: 1,
          borderColor: "#111827",
        },
        style,
      ]}
    >
      <Text
        style={{
          color: isPrimary ? "white" : "#111827",
          fontWeight: "600",
          fontSize: 16,
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}