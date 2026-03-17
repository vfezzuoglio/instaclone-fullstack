import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, RefreshControl } from "react-native";
import ScreenWrapper from "../../../components/ui/ScreenWrapper";
import PostCard from "../../../components/post/PostCard";
import { useApp } from "../../../context/AppContext";

export default function HomeScreen() {
  const {
    posts,
    commentsByPost,
    toggleLike,
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

  return (
    <ScreenWrapper padded={false}>
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
          />
        )}
      />
    </ScreenWrapper>
  );
}