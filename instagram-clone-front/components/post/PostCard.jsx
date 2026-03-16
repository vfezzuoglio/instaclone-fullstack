import { useEffect, useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";

export default function PostCard({
  post,
  comments,
  onToggleLike,
  onLoadComments,
  onAddComment,
}) {
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    onLoadComments(post.id);
  }, [onLoadComments, post.id]);

  const handleAddComment = async () => {
    const trimmed = newComment.trim();
    if (!trimmed || submittingComment) return;

    setSubmittingComment(true);
    try {
      await onAddComment(post.id, trimmed);
      setNewComment("");
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 18,
        overflow: "hidden",
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          padding: 12,
        }}
      >
        <Image
          source={{ uri: post.user.avatar }}
          style={{ width: 38, height: 38, borderRadius: 19 }}
        />
        <Text style={{ fontWeight: "700", fontSize: 15 }}>
          {post.user.username}
        </Text>
      </View>

      <Image
        source={{ uri: post.image }}
        style={{ width: "100%", height: 320 }}
        resizeMode="cover"
      />

      <View style={{ padding: 12, gap: 10 }}>
        {!!post.caption && <Text style={{ fontSize: 15 }}>{post.caption}</Text>}

        <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
          <Pressable
            onPress={() => onToggleLike(post.id)}
            style={{
              borderWidth: 1,
              borderColor: "#D1D5DB",
              borderRadius: 999,
              paddingHorizontal: 14,
              paddingVertical: 10,
            }}
          >
            <Text style={{ fontSize: 18 }}>
              {post.likedByMe ? "❤️" : "🤍"}
            </Text>
          </Pressable>

          <Text style={{ fontWeight: "600" }}>{post.likesCount} likes</Text>
          <Text style={{ color: "#6B7280" }}>{post.commentsCount} comments</Text>
        </View>

        <View style={{ gap: 8 }}>
          {(comments || []).map((comment) => (
            <View key={comment.id} style={{ flexDirection: "row", gap: 6 }}>
              <Text style={{ fontWeight: "700" }}>{comment.username}</Text>
              <Text style={{ flex: 1 }}>{comment.text}</Text>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <TextInput
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Write a comment"
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#D1D5DB",
              borderRadius: 999,
              paddingHorizontal: 14,
              paddingVertical: 10,
              backgroundColor: "#F9FAFB",
            }}
          />
          <Pressable
            onPress={handleAddComment}
            style={{
              borderWidth: 1,
              borderColor: "#111827",
              borderRadius: 999,
              paddingHorizontal: 14,
              paddingVertical: 10,
              backgroundColor: "#111827",
            }}
          >
            <Text style={{ color: "white", fontWeight: "700" }}>
              {submittingComment ? "..." : "Post"}
            </Text>
          </Pressable>
        </View>

        <Text style={{ color: "#6B7280", fontSize: 12 }}>{post.createdAt}</Text>
      </View>
    </View>
  );
}