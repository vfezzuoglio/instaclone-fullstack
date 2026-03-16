import { useState } from "react";
import { Alert, Text, View } from "react-native";
import { Link, router } from "expo-router";
import ScreenWrapper from "../../components/ui/ScreenWrapper";
import AppInput from "../../components/ui/AppInput";
import AppButton from "../../components/ui/AppButton";
import { useApp } from "../../context/AppContext";

export default function LoginScreen() {
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = () => {
    const ok = login({ email, password });

    if (!ok) {
      Alert.alert("Login failed", "Please enter email and password.");
      return;
    }

    router.replace("/(tabs)/home");
  };

  return (
    <ScreenWrapper>
      <View style={{ flex: 1, justifyContent: "center", gap: 18 }}>
        <Text style={{ fontSize: 32, fontWeight: "800", textAlign: "center" }}>
          InstaClone
        </Text>

        <AppInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
        />

        <AppInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
        />

        <AppButton title="Login" onPress={onLogin} />

        <Text style={{ textAlign: "center", color: "#6B7280" }}>
          Don't have an account?{" "}
          <Link href="/(auth)/signup" style={{ color: "#111827", fontWeight: "700" }}>
            Sign up
          </Link>
        </Text>
      </View>
    </ScreenWrapper>
  );
}