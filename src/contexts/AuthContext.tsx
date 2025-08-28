import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authApi, userApi, type User } from '@/lib/auth-api';
import { useToast } from '@/hooks/use-toast';

interface DecodedToken {
  id: string;
  sub: string;
  username: string;
  exp: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const isAuthenticated = !!user;

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const decoded: DecodedToken = jwtDecode(token);

      // Check if token is expired
      if (decoded.exp * 1000 < Date.now()) {
        logout();
        return;
      }
      
      const userId = decoded.id;
      if (!userId) {
        logout();
        return;
      }

      const userData = await userApi.getUser(userId);
      setUser(userData);
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { accessToken, refreshToken, myProfile } = await authApi.login({ email, password });
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userEmail', myProfile.email);

      setUser(myProfile);

      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      });
    } catch (error: any) {
      console.error('Login failed:', error.response);
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Invalid email or password",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signup = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
  }) => {
    try {
      const { accessToken, refreshToken, myProfile } = await authApi.signup(userData);
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userEmail', myProfile.email);

      setUser(myProfile);

      toast({
        title: "Account created!",
        description: "Welcome to Reflections. Start writing your first post!",
      });
    } catch (error: any) {
      console.error('Signup failed:', error.response);
      toast({
        title: "Signup failed",
        description: error.response?.data?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
