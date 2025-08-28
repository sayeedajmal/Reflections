"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';

// Define the shape of the user object based on your backend response
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  avatarUrl?: string | null;
  role: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUserCookie = getCookie('user');
      const storedAccess = getCookie('accessToken');
      const storedRefresh = getCookie('refreshToken');
      
      const storedUser = storedUserCookie ? JSON.parse(decodeURIComponent(storedUserCookie)) : null;

      if (storedUser && storedAccess && storedRefresh) {
        setUser(storedUser);
        setAccessToken(storedAccess as string);
        setRefreshToken(storedRefresh as string);
      }
    } catch (error) {
      console.error("Failed to parse auth data from cookies", error);
      // Clear potentially corrupted data
      deleteCookie('user');
      deleteCookie('accessToken');
      deleteCookie('refreshToken');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData: User, access: string, refresh: string) => {
    const cookieOptions = { secure: true, sameSite: 'strict', maxAge: 60 * 60 * 24 * 7 };
    const userString = encodeURIComponent(JSON.stringify(userData));
    
    setCookie('user', userString, cookieOptions);
    setCookie('accessToken', access, cookieOptions);
    setCookie('refreshToken', refresh, cookieOptions);

    setUser(userData);
    setAccessToken(access);
    setRefreshToken(refresh);
  };

  const logout = () => {
    deleteCookie('user');
    deleteCookie('accessToken');
    deleteCookie('refreshToken');
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    router.push('/login');
  };

  const value = {
    user,
    accessToken,
    refreshToken,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};