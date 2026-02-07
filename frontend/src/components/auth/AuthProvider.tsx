"use client"
// frontend/src/components/auth/AuthProvider.tsx
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

        // Extract user details from token payload
        try {
          const tokenParts = storedToken.split('.');
          if (tokenParts.length === 3) {
            const payloadStr = atob(tokenParts[1]);
            const payload = JSON.parse(payloadStr);
            const mockUser: User = {
              id: payload.sub ? parseInt(payload.sub) : 0,
              email: payload.email || 'unknown@example.com',
              username: payload.email?.split('@')[0] || 'user',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              isActive: true
            };
            setUser(mockUser);
          }
        } catch (e) {
          console.warn('Could not parse token payload to create user object');
          // Fallback to a generic user
          setUser({
            id: 0,
            email: 'unknown@example.com',
            username: 'user',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isActive: true
          });
        }
      } else {
        // Token is invalid or expired, clear it
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error verifying stored token:', error);
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (credentials: SignUpData) => {
    try {
       const response = await authAPI.signUp(credentials);

      // Do NOT auto-login after signup - only store the token temporarily
      // The user will need to login separately
      if (response.access_token) {
        // Temporarily store the token but don't set auth state
        localStorage.setItem('auth_token', response.access_token);
      }

      // Do NOT set isAuthenticated to true or set user after signup
      // User will authenticate separately on login page
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signIn = async (credentials: AuthCredentials) => {
    try {
      const response = await authAPI.signIn(credentials);

      // Store the token in localStorage
      if (response.access_token) {
        localStorage.setItem('auth_token', response.access_token);
        setToken(response.access_token);
        setIsAuthenticated(true);

        // Create user object from response and token payload
        const tokenParts = response.access_token.split('.');
        let userId = response.user_id;
        let userEmail = credentials.email;
        let username = credentials.email.split('@')[0];

        if (tokenParts.length === 3) {
          try {
            const payloadStr = atob(tokenParts[1]);
            const payload = JSON.parse(payloadStr);
            userId = parseInt(payload.sub) || response.user_id;
            userEmail = payload.email || credentials.email;
            username = payload.email?.split('@')[0] || username;
          } catch (e) {
            console.warn('Could not parse token payload');
          }
        }

        const mockUser: User = {
          id: userId,
          email: userEmail,
          username: username,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true
        };
        setUser(mockUser);
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

