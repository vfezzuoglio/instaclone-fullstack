import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Platform, RefreshControl, View } from "react-native";
import { router } from "expo-router";
import ScreenWrapper from "../../../components/ui/ScreenWrapper";
import PostCard from "../../../components/post/PostCard";
import { useApp } from "../../../context/AppContext";

export default function HomeScreen() {
  const {
    posts,
    commentsByPost,
    toggleLike,
    deletePost,
    addComment,
    fetchComments,
    fetchFeed,
    user,
  } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  const loadFeed = useCallback(async () => {
    if (!user) return;

    setRefreshing(true);
    try {
      await fetchFeed();
    } catch (error) {
      Alert.alert("Feed error", error.message || "Failed to load posts.");
    } finally {
      setRefreshing(false);
    }
  }, [fetchFeed, user]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const onToggleLike = useCallback(async (postId) => {
    try {
      await toggleLike(postId);
    } catch (error) {
      Alert.alert("Like failed", error.message || "Please try again.");
    }
  }, [toggleLike]);

  const onLoadComments = useCallback(async (postId) => {
    try {
      await fetchComments(postId);
    } catch (error) {
      Alert.alert("Comments error", error.message || "Failed to load comments.");
    }
  }, [fetchComments]);

  const onAddComment = useCallback(async (postId, text) => {
    try {
      await addComment(postId, text);
    } catch (error) {
      Alert.alert("Comment failed", error.message || "Please try again.");
      throw error;
    }
  }, [addComment]);

  const onDeletePost = useCallback((postId) => {
    const performDelete = async () => {
      try {
        await deletePost(postId);
      } catch (error) {
        Alert.alert("Delete failed", error.message || "Please try again.");
      }
    };

    if (Platform.OS === "web") {
      const confirmed = typeof window !== "undefined"
        ? window.confirm("Are you sure you want to delete this post?")
        : true;
      if (confirmed) {
        void performDelete();
      }
      return;
    }

    Alert.alert("Delete post", "Are you sure you want to delete this post?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          void performDelete();
        },
      },
    ]);
  }, [deletePost]);

  const onPressUser = useCallback((username, isMe) => {
    if (!username) return;

    if (isMe) {
      router.push("/(tabs)/profile");
      return;
    }

    router.push({
      pathname: "/users/[username]",
      params: { username },
    });
  }, []);

  return (
    <ScreenWrapper padded={false}>
      <View
        style={Platform.OS === "web" ? {
          maxWidth: 600,
          marginHorizontal: "auto",
          width: "100%",
          flex: 1,
        } : { flex: 1 }}
      >
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadFeed} />}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              comments={commentsByPost[item.id] || []}
              onToggleLike={onToggleLike}
              onLoadComments={onLoadComments}
              onAddComment={onAddComment}
              onDeletePost={onDeletePost}
              onPressUser={onPressUser}
            />
          )}
        />
      </View>
    </ScreenWrapper>
  );
}