import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import ScreenWrapper from "../../../components/ui/ScreenWrapper";
import AppButton from "../../../components/ui/AppButton";
import { useApp } from "../../../context/AppContext";
import { router } from "expo-router";

export default function ProfileScreen() {
  const { user, posts, logout, fetchFeed } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const myPosts = useMemo(
    () => posts.filter((post) => post.user.username === user?.username),
    [posts, user?.username]
  );

  const onRefresh = useCallback(async () => {
    if (!user) return;

    setRefreshing(true);
    try {
      await fetchFeed();
    } catch (error) {
      Alert.alert("Refresh failed", error.message || "Failed to load your posts.");
    } finally {
      setRefreshing(false);
    }
  }, [fetchFeed, user]);

  useEffect(() => {
    if (!user || posts.length > 0) return;

    onRefresh();
  }, [onRefresh, posts.length, user]);

  const onLogout = () => {
    logout();
    router.replace("/(auth)/login");
  };

  const onOpenPost = (post) => {
    setSelectedPost(post);
  };

  const onClosePost = () => {
    setSelectedPost(null);
  };

  if (!user) return null;

  const header = (
    <View style={{ gap: 18, paddingHorizontal: 16, paddingVertical: 12 }}>
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
          <Text style={{ fontSize: 20, fontWeight: "800" }}>0</Text>
          <Text>Followers</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 20, fontWeight: "800" }}>0</Text>
          <Text>Following</Text>
        </View>
      </View>

      <AppButton title="Logout" variant="secondary" onPress={onLogout} />

      <Text style={{ fontSize: 16, fontWeight: "700" }}>Your Posts</Text>
    </View>
  );

  return (
    <ScreenWrapper padded={false}>
      <FlatList
        data={myPosts}
        keyExtractor={(item) => item.id}
        numColumns={4}
        ListHeaderComponent={header}
        contentContainerStyle={{ paddingBottom: 20 }}
        columnWrapperStyle={{ gap: 2 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
            <Text style={{ color: "#6B7280" }}>You have not posted any images yet.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onOpenPost(item)}
            style={{
              flex: 1 / 4,
              aspectRatio: 1,
              marginBottom: 2,
            }}
          >
            <Image
              source={{ uri: item.image }}
              style={{ width: "100%", height: "100%", backgroundColor: "#E5E7EB" }}
              resizeMode="cover"
            />
          </Pressable>
        )}
      />

      <Modal
        visible={!!selectedPost}
        transparent
        animationType="fade"
        onRequestClose={onClosePost}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(17, 24, 39, 0.86)",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 16,
          }}
        >
          <View
            style={{
              width: "100%",
              maxWidth: 440,
              maxHeight: "88%",
              backgroundColor: "white",
              borderRadius: 20,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          >
            <Image
              source={{ uri: selectedPost?.image }}
              style={{ width: "100%", height: 360, maxHeight: "70%", backgroundColor: "#E5E7EB" }}
              resizeMode="contain"
            />

            <View style={{ padding: 14, gap: 8 }}>
              {!!selectedPost?.caption && (
                <Text style={{ fontSize: 15 }}>{selectedPost.caption}</Text>
              )}

              <Text style={{ color: "#374151", fontWeight: "600" }}>
                {selectedPost?.likesCount ?? 0} likes • {selectedPost?.commentsCount ?? 0} comments
              </Text>
              <Text style={{ color: "#6B7280", fontSize: 12 }}>
                Posted {selectedPost?.createdAt || "recently"}
              </Text>

              <Pressable
                onPress={onClosePost}
                style={{
                  marginTop: 4,
                  backgroundColor: "#111827",
                  borderRadius: 999,
                  paddingVertical: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontWeight: "700" }}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}