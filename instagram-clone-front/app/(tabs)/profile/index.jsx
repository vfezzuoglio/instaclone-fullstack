import { Image, Text, View } from "react-native";
import ScreenWrapper from "../../../components/ui/ScreenWrapper";
import AppButton from "../../../components/ui/AppButton";
import { useApp } from "../../../context/AppContext";
import { router } from "expo-router";

export default function ProfileScreen() {
  const { user, posts, logout } = useApp();

  const myPosts = posts.filter((post) => post.user.username === user?.username);

  const onLogout = () => {
    logout();
    router.replace("/(auth)/login");
  };

  if (!user) return null;

  return (
    <ScreenWrapper>
      <View style={{ gap: 18 }}>
        <View style={{ alignItems: "center", gap: 12 }}>
          <Image
            source={{ uri: user.avatar }}
            style={{ width: 90, height: 90, borderRadius: 45 }}
          />
          <Text style={{ fontSize: 24, fontWeight: "800" }}>{user.username}</Text>
          <Text style={{ color: "#6B7280", textAlign: "center" }}>{user.bio}</Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            paddingVertical: 12,
            backgroundColor: "white",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#E5E7EB",
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 20, fontWeight: "800" }}>{myPosts.length}</Text>
            <Text>Posts</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 20, fontWeight: "800" }}>12</Text>
            <Text>Followers</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 20, fontWeight: "800" }}>7</Text>
            <Text>Following</Text>
          </View>
        </View>

        <AppButton title="Logout" variant="secondary" onPress={onLogout} />
      </View>
    </ScreenWrapper>
  );
}