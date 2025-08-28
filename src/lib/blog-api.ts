import api from '@/lib/api';

export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatarUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
  status: PostStatus;
  featuredImageUrl?: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  excerpt?: string;
  status: PostStatus;
  featuredImageUrl?: string;
}

export interface UpdatePostRequest extends Partial<CreatePostRequest> {
  id: string;
}

export const blogApi = {
  async getAllPosts(): Promise<BlogPost[]> {
    const response = await api.get('/api/blogposts');
    return response.data.data;
  },

  async getPost(id: string): Promise<BlogPost> {
    const response = await api.get(`/api/blogposts/${id}`);
    return response.data.data;
  },

  async getPostsByAuthor(authorId: string): Promise<BlogPost[]> {
    const response = await api.get(`/api/blogposts/author/${authorId}`);
    return response.data.data;
  },

  async createPost(postData: CreatePostRequest): Promise<BlogPost> {
    const response = await api.post('/api/blogposts', postData);
    return response.data.data;
  },

  async updatePost(id: string, postData: UpdatePostRequest): Promise<BlogPost> {
    const response = await api.put(`/api/blogposts/${id}`, postData);
    return response.data.data;
  },

  async deletePost(id: string): Promise<void> {
    await api.delete(`/api/blogposts/${id}`);
  },
};
