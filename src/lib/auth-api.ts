import api from '@/lib/api';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  avatarUrl?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    return response;
  },

  async signup(userData: SignupRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/signup', userData);
    return response;
  },

  async refreshToken(refreshToken: string, email: string): Promise<AuthResponse> {
    const response = await api.post('/auth/refresh-token', {
      refreshToken,
      email,
    });
    return response;
  },
};

export const userApi = {
  async getUser(id: string): Promise<User> {
    const response = await api.get(`/users/id/${id}`);
    return response.data;
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await api.post('/users/update', userData);
    return response.data;
  },
};