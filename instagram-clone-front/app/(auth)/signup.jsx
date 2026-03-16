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
  const [submitting, setSubmitting] = useState(false);

  const onSignup = async () => {
    if (submitting) return;

    setSubmitting(true);
    try {
      await signup({ username, email, password });
      router.replace("/(tabs)/home");
    } catch (error) {
      Alert.alert("Signup failed", error.message || "Please try again.");
    } finally {
      setSubmitting(false);
    }
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

        <AppButton
          title={submitting ? "Creating account..." : "Sign Up"}
          onPress={onSignup}
        />

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