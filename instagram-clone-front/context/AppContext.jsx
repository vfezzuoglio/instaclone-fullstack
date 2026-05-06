import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { buildApiUrl } from "../services/api";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { apiRequest } from "../services/api";
import { auth } from "../services/firebase";

const AppContext = createContext(null);

function formatCreatedAt(value) {
  if (!value) return "just now";

  const createdAt = new Date(value);
  if (Number.isNaN(createdAt.getTime())) return "just now";

  const diffMs = Date.now() - createdAt.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < hour) {
    const minutes = Math.max(1, Math.floor(diffMs / minute));
    return `${minutes}m`;
  }
  if (diffMs < day) {
    return `${Math.floor(diffMs / hour)}h`;
  }
  return `${Math.floor(diffMs / day)}d`;
}

function avatarForUsername(username) {
  const safe = encodeURIComponent(username || "user");
  return `https://api.dicebear.com/9.x/initials/png?seed=${safe}`;
}

function mapPost(apiPost) {
  const username = apiPost.username || "user";
  const resolvedImage = (() => {
    const raw = apiPost.imageUrl || "";
    if (!raw) return "";
    try {
      const parsed = new URL(raw);
      // If the API returned a localhost URL (common in dev), replace host with the app's API host
      if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
        const base = buildApiUrl("/");
        try {
          const baseUrl = new URL(base);
          return `${baseUrl.origin}${parsed.pathname}${parsed.search}`;
        } catch {
          return buildApiUrl(parsed.pathname + parsed.search);
        }
      }

      return raw;
    } catch {
      // Not an absolute URL, treat as relative path
      return raw.startsWith("/") ? buildApiUrl(raw) : buildApiUrl(`/${raw}`);
    }
  })();

  return {
    id: String(apiPost.id),
    user: {
      id: String(apiPost.userId ?? "0"),
      username,
      avatar: avatarForUsername(username),
    },
    image: resolvedImage,
    caption: apiPost.caption || "",
    likesCount: apiPost.likesCount ?? 0,
    commentsCount: apiPost.commentsCount ?? 0,
    likedByMe: apiPost.likedByMe ?? false,
    canDelete: apiPost.canDelete ?? false,
    createdAt: formatCreatedAt(apiPost.createdAt),
  };
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [posts, setPosts] = useState([]);
  const [commentsByPost, setCommentsByPost] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setToken(null);
        setPosts([]);
        setCommentsByPost({});
        return;
      }

      const authToken = await firebaseUser.getIdToken();
      const derivedUsername = firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "user";

      setToken(authToken);
      setUser({
        id: firebaseUser.uid,
        username: derivedUsername,
        email: firebaseUser.email || "",
        bio: "",
        avatar: avatarForUsername(derivedUsername),
      });
    });

    return unsubscribe;
  }, []);

  const mapComment = (apiComment) => ({
    id: String(apiComment.id),
    text: apiComment.text || "",
    username: apiComment.username || "user",
    createdAt: formatCreatedAt(apiComment.createdAt),
  });

  const fetchFeed = useCallback(async (authToken = token) => {
    if (!authToken) {
      setPosts([]);
      return;
    }

    const feed = await apiRequest("/api/posts/feed", {
      method: "GET",
      token: authToken,
    });

    setPosts(Array.isArray(feed) ? feed.map(mapPost) : []);
  }, [token]);

  const fetchComments = useCallback(async (postId) => {
    if (!postId) return [];

    const comments = await apiRequest(`/api/posts/${postId}/comments`, {
      method: "GET",
    });

    const mapped = Array.isArray(comments) ? comments.map(mapComment) : [];

    setCommentsByPost((prev) => ({
      ...prev,
      [postId]: mapped,
    }));

    return mapped;
  }, []);

  const login = async ({ email, password }) => {
    const trimmedEmail = email?.trim() ?? "";
    const trimmedPassword = password?.trim() ?? "";

    if (!trimmedEmail || !trimmedPassword) {
      throw new Error("Please enter email and password.");
    }

    const credential = await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
    const authToken = await credential.user.getIdToken();

    setUser({
      id: credential.user.uid,
      username: credential.user.displayName || trimmedEmail.split("@")[0],
      email: trimmedEmail,
      bio: "",
      avatar: avatarForUsername(credential.user.displayName || trimmedEmail.split("@")[0]),
    });
    setToken(authToken);
  };

  const signup = async ({ username, email, password }) => {
    const trimmedUsername = username?.trim() ?? "";
    const trimmedEmail = email?.trim() ?? "";
    const trimmedPassword = password?.trim() ?? "";

    if (!trimmedUsername || !trimmedEmail || !trimmedPassword) {
      throw new Error("Please fill out all fields.");
    }

    const credential = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
    await updateProfile(credential.user, { displayName: trimmedUsername });
    const authToken = await credential.user.getIdToken(true);

    setUser({
      id: credential.user.uid,
      username: trimmedUsername,
      email: trimmedEmail,
      bio: "",
      avatar: avatarForUsername(trimmedUsername),
    });
    setToken(authToken);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setToken(null);
    setPosts([]);
    setCommentsByPost({});
  };

  const addComment = async (postId, text) => {
    const trimmedText = text?.trim() ?? "";

    if (!trimmedText) {
      throw new Error("Comment cannot be empty.");
    }

    if (!token) {
      throw new Error("Please login again.");
    }

    const comment = await apiRequest(`/api/posts/${postId}/comments`, {
      method: "POST",
      token,
      body: { text: trimmedText },
    });

    const mapped = mapComment(comment);

    setCommentsByPost((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), mapped],
    }));

    setPosts((prev) =>
      prev.map((item) =>
        item.id === postId
          ? { ...item, commentsCount: item.commentsCount + 1 }
          : item
      )
    );
  };

  const toggleLike = async (postId) => {
    if (!token) {
      throw new Error("Please login again.");
    }

    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    await apiRequest(`/api/posts/${postId}/like`, {
      method: post.likedByMe ? "DELETE" : "POST",
      token,
    });

    setPosts((prev) =>
      prev.map((item) => {
        if (item.id !== postId) return item;

        const nextLiked = !item.likedByMe;
        return {
          ...item,
          likedByMe: nextLiked,
          likesCount: nextLiked
            ? item.likesCount + 1
            : Math.max(0, item.likesCount - 1),
        };
      })
    );
  };

  const createPost = async ({ imageUrl, caption }) => {
    const trimmedCaption = caption?.trim() ?? "";
    const trimmedImage = imageUrl?.trim() ?? "";

    if (!trimmedImage) {
      throw new Error("Please add an image.");
    }

    if (!token || !user) {
      throw new Error("Please login again.");
    }

    await apiRequest("/api/posts", {
      method: "POST",
      token,
      body: {
        imageUrl: trimmedImage,
        caption: trimmedCaption,
      },
    });

    await fetchFeed(token);
  };

  const deletePost = async (postId) => {
    if (!token) {
      throw new Error("Please login again.");
    }

    await apiRequest(`/api/posts/${postId}`, {
      method: "DELETE",
      token,
    });

    setPosts((prev) => prev.filter((item) => item.id !== postId));
    setCommentsByPost((prev) => {
      const next = { ...prev };
      delete next[postId];
      return next;
    });
  };

  const value = useMemo(
    () => ({
      user,
      token,
      posts,
      commentsByPost,
      fetchFeed,
      fetchComments,
      login,
      signup,
      logout,
      toggleLike,
      addComment,
      createPost,
      deletePost,
    }),
    [user, token, posts, commentsByPost, fetchFeed, fetchComments]
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