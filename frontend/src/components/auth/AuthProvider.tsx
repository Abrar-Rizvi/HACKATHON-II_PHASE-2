// frontend/src/components/auth/AuthProvider.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthCredentials, SignUpData, LoginResponse, AuthContextType } from '../../types/auth';
import { verifyToken, isTokenExpired } from '../../lib/auth/jwt-utils';
import { authAPI } from '../../lib/api/auth-api';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for existing token on initial load
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      verifyStoredToken(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyStoredToken = async (storedToken: string) => {
    try {
      const isValid = await authAPI.verifyToken(storedToken);
      if (isValid && !isTokenExpired(storedToken)) {
        setToken(storedToken);
        setIsAuthenticated(true);
        // In a real app, we would fetch user details here using the token
        // For now, we'll set a placeholder user
        setUser({
          id: 'placeholder-id',
          email: 'placeholder@example.com',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      } else {
        // Token is invalid or expired, clear it
        localStorage.removeItem('auth_token');
        setToken(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error verifying stored token:', error);
      localStorage.removeItem('auth_token');
      setToken(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (credentials: SignUpData) => {
    try {
      const response = await authAPI.signUp(credentials);

      // Store the token in localStorage
      if (response.token.accessToken) {
        localStorage.setItem('auth_token', response.token.accessToken);
        setToken(response.token.accessToken);
        setIsAuthenticated(true);
        // In a real app, we would set user details from the response
        setUser({
          id: 'new-user-id',
          email: credentials.email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signIn = async (credentials: AuthCredentials) => {
    try {
      const response = await authAPI.signIn(credentials);

      // Store the token in localStorage
      if (response.token.accessToken) {
        localStorage.setItem('auth_token', response.token.accessToken);
        setToken(response.token.accessToken);
        setIsAuthenticated(true);
        // In a real app, we would set user details from the response
        setUser({
          id: 'signed-in-user-id',
          email: credentials.email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Call the API to invalidate the session (if needed)
      await authAPI.signOut();
    } catch (error) {
      console.error('Sign out API error:', error);
      // Even if API call fails, we should still clear local state
    } finally {
      // Clear token from storage
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const verifyTokenHandler = async (token: string) => {
    try {
      const result = await verifyToken(token);
      return !!result;
    } catch (error) {
      console.error('Error verifying token:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    signUp,
    signIn,
    signOut,
    verifyToken: verifyTokenHandler
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
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

