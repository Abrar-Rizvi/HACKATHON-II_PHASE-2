// frontend/src/lib/auth/auth-context.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthCredentials, SignUpData, LoginResponse, AuthContextType } from '../../types/auth';
import { verifyToken, isTokenExpired } from './jwt-utils';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
      const isValid = await verifyToken(storedToken);
      if (isValid && !isTokenExpired(storedToken)) {
        setToken(storedToken);
        setIsAuthenticated(true);
        // We would normally fetch user details here using the token
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
    // Implementation will connect to the backend auth API
    console.log('Signing up with:', credentials);
    // This is a placeholder - would connect to actual backend API
    throw new Error('Sign up functionality not yet implemented');
  };

  const login = async (credentials: AuthCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      // Implementation will connect to the backend auth API
      console.log('Signing in with:', credentials);
      // This is a placeholder - would connect to actual backend API
      throw new Error('Sign in functionality not yet implemented');
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (credentials: AuthCredentials) => {
    // Alias for login method to maintain compatibility
    return await login(credentials);
  };

  const signOut = async () => {
    // Clear token from storage
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
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
    error,
    login,
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