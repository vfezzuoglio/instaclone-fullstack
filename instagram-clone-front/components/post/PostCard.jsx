import { Image, Pressable, Text, View } from "react-native";

export default function PostCard({ post, onToggleLike }) {
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

        <Text style={{ color: "#6B7280", fontSize: 12 }}>{post.createdAt}</Text>
      </View>
    </View>
  );
}