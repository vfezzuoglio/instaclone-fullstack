import { FlatList } from "react-native";
import ScreenWrapper from "../../../components/ui/ScreenWrapper";
import PostCard from "../../../components/post/PostCard";
import { useApp } from "../../../context/AppContext";

export default function HomeScreen() {
  const { posts, toggleLike } = useApp();

  return (
    <ScreenWrapper padded={false}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <PostCard post={item} onToggleLike={toggleLike} />
        )}
      />
    </ScreenWrapper>
  );
}