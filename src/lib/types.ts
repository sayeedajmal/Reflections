export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  publishedAt: string;
  imageUrl: string;
}
