export const mockUser = {
  id: "u1",
  username: "vincent_mobile",
  name: "Vincent Fezzuoglio",
  bio: "Building an Instagram clone with React Native and .NET",
  avatar:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=60",
};

export const mockPosts = [
  {
    id: "p1",
    user: {
      id: "u1",
      username: "vincent_mobile",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=60",
    },
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=60",
    caption: "hello from mobile",
    likesCount: 2,
    commentsCount: 2,
    likedByMe: true,
    createdAt: "2h",
  },
  {
    id: "p2",
    user: {
      id: "u2",
      username: "design.daily",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=60",
    },
    image:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1200&auto=format&fit=crop&q=60",
    caption: "Mocking the UI before wiring the backend",
    likesCount: 8,
    commentsCount: 3,
    likedByMe: false,
    createdAt: "5h",
  },
];