import { useState } from "react";
import { Alert, Text, View } from "react-native";
import { Link, router } from "expo-router";
import ScreenWrapper from "../../components/ui/ScreenWrapper";
import AppInput from "../../components/ui/AppInput";
import AppButton from "../../components/ui/AppButton";
import { useApp } from "../../context/AppContext";

export default function SignupScreen() {
  const { signup } = useApp();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignup = () => {
    const ok = signup({ username, email, password });

    if (!ok) {
      Alert.alert("Signup failed", "Please fill out all fields.");
      return;
    }

    router.replace("/(tabs)/home");
  };

  return (
    <ScreenWrapper>
      <View style={{ flex: 1, justifyContent: "center", gap: 18 }}>
        <Text style={{ fontSize: 32, fontWeight: "800", textAlign: "center" }}>
          Create Account
        </Text>

        <AppInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          placeholder="Choose a username"
          autoCapitalize="none"
        />

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
          placeholder="Create a password"
          secureTextEntry
        />

        <AppButton title="Sign Up" onPress={onSignup} />

        <Text style={{ textAlign: "center", color: "#6B7280" }}>
          Already have an account?{" "}
          <Link href="/(auth)/login" style={{ color: "#111827", fontWeight: "700" }}>
            Login
          </Link>
        </Text>
      </View>
    </ScreenWrapper>
  );
}