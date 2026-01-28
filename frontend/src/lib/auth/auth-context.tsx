// frontend/src/lib/auth/auth-context.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthCredentials, SignUpData, LoginResponse, AuthContextType, JWTToken } from '../../types/auth';
import { verifyToken, isTokenExpired } from './jwt-utils';
import { authAPI } from '../api/auth-api';

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
      const isValid = await verifyToken(storedToken);
      if (isValid && !isTokenExpired(storedToken)) {
        setToken(storedToken);
        setIsAuthenticated(true);
        // Set user based on token payload (we'd normally fetch user details)
        try {
          const tokenParts = storedToken.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            const mockUser: User = {
              id: payload.sub,
              email: payload.email,
              username: payload.email.split('@')[0],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              isActive: true
            };
            setUser(mockUser);
          }
        } catch (e) {
          console.warn('Could not parse token payload to create user object');
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

      // Store token in localStorage
      localStorage.setItem('auth_token', response.access_token);

      // Set state
      setToken(response.access_token);
      setIsAuthenticated(true);

      // Create mock user object from response
      const mockUser: User = {
        id: response.user_id,
        email: credentials.email,
        username: credentials.username,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      };
      setUser(mockUser);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signIn = async (credentials: AuthCredentials) => {
    try {
      const response = await authAPI.signIn(credentials);

      // Store token in localStorage
      localStorage.setItem('auth_token', response.access_token);

      // Set state
      setToken(response.access_token);
      setIsAuthenticated(true);

      // Create mock user object from response
      const tokenParts = response.access_token.split('.');
      let userId = response.user_id;
      let userEmail = credentials.email;

      if (tokenParts.length === 3) {
        try {
          const payload = JSON.parse(atob(tokenParts[1]));
          userId = parseInt(payload.sub) || response.user_id;
          userEmail = payload.email || credentials.email;
        } catch (e) {
          console.warn('Could not parse token payload');
        }
      }

      const mockUser: User = {
        id: userId,
        email: userEmail,
        username: userEmail.split('@')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      };
      setUser(mockUser);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authAPI.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
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
      const result = await authAPI.verifyToken(token);
      return result;
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