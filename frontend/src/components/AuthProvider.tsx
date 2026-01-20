'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserSession, User, LoginRequest, RegisterRequest } from '@/types/user';
import apiClient from '@/lib/api';

interface AuthContextType {
  session: UserSession;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<UserSession>({
    user: null,
    jwtToken: null,
    expiresAt: null,
    isLoggedIn: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on initial load
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const userData = localStorage.getItem('userData');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setSession({
          user: parsedUser,
          jwtToken: token,
          expiresAt: localStorage.getItem('expiresAt'),
          isLoggedIn: true,
        });
        apiClient.setToken(token);
      } catch (err) {
        console.error('Error parsing stored session data:', err);
        // Clear invalid stored data
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('expiresAt');
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.login(credentials);

      if (response.success && response.token && response.user) {
        // Store session data
        localStorage.setItem('jwtToken', response.token);
        localStorage.setItem('userData', JSON.stringify(response.user));

        // Calculate and store expiration time (assuming token validity)
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours from now
        localStorage.setItem('expiresAt', expiresAt);

        setSession({
          user: response.user,
          jwtToken: response.token,
          expiresAt,
          isLoggedIn: true,
        });

        apiClient.setToken(response.token);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.register(userData);

      if (response.success && response.token && response.user) {
        // Store session data
        localStorage.setItem('jwtToken', response.token);
        localStorage.setItem('userData', JSON.stringify(response.user));

        // Calculate and store expiration time
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours from now
        localStorage.setItem('expiresAt', expiresAt);

        setSession({
          user: response.user,
          jwtToken: response.token,
          expiresAt,
          isLoggedIn: true,
        });

        apiClient.setToken(response.token);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear stored session data
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('expiresAt');

    setSession({
      user: null,
      jwtToken: null,
      expiresAt: null,
      isLoggedIn: false,
    });

    apiClient.logout();
  };

  const value = {
    session,
    login,
    register,
    logout,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};