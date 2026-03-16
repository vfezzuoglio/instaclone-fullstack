import { createContext, useContext, useMemo, useState } from "react";
import { mockPosts, mockUser } from "../services/mockData";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(mockPosts);

  const login = ({ email, password }) => {
    if (!email || !password) return false;
    setUser(mockUser);
    return true;
  };

  const signup = ({ username, email, password }) => {
    if (!username || !email || !password) return false;
    setUser({
      ...mockUser,
      username,
    });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const toggleLike = (postId) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;

        const nextLiked = !post.likedByMe;
        return {
          ...post,
          likedByMe: nextLiked,
          likesCount: nextLiked
            ? post.likesCount + 1
            : Math.max(0, post.likesCount - 1),
        };
      })
    );
  };

  const createPost = ({ image, caption }) => {
    const trimmedCaption = caption?.trim() ?? "";
    const trimmedImage = image?.trim() ?? "";

    if (!trimmedImage || !user) return false;

    const newPost = {
      id: Date.now().toString(),
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
      },
      image: trimmedImage,
      caption: trimmedCaption,
      likesCount: 0,
      commentsCount: 0,
      likedByMe: false,
      createdAt: "now",
    };

    setPosts((prev) => [newPost, ...prev]);
    return true;
  };

  const value = useMemo(
    () => ({
      user,
      posts,
      login,
      signup,
      logout,
      toggleLike,
      createPost,
    }),
    [user, posts]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used inside AppProvider");
  }
  return context;
}