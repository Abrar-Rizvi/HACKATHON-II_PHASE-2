// frontend/tests/integration/auth-flow.test.ts
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '../../src/components/auth/AuthProvider';
import SignupForm from '../../src/components/auth/SignupForm';
import LoginForm from '../../src/components/auth/LoginForm';
import ProtectedRoute from '../../src/components/auth/ProtectedRoute';
import { AuthCredentials, SignUpData } from '../../src/types/auth';

// Mock the authAPI module
jest.mock('../../src/lib/api/auth-api', () => ({
  authAPI: {
    signUp: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
    verifyToken: jest.fn(),
  },
}));

import { authAPI } from '../../src/lib/api/auth-api';

// Mock implementation of the API methods
const mockAuthAPI = authAPI as jest.Mocked<typeof authAPI>;

describe('Authentication Flow Integration Tests', () => {
  const mockNavigate = jest.fn();

  // Mock the next/navigation useRouter
  jest.mock('next/navigation', () => ({
    useRouter: () => ({
      push: mockNavigate,
      prefetch: jest.fn(),
    }),
  }));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Signup Flow', () => {
    it('should handle successful signup flow', async () => {
      const mockSignupData: SignUpData = {
        email: 'test@example.com',
        password: 'ValidPass123!',
        confirmPassword: 'ValidPass123!'
      };

      const mockApiResponse = {
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        token: {
          accessToken: 'test-access-token',
          expiresIn: 3600,
          tokenType: 'Bearer'
        }
      };

      mockAuthAPI.signUp.mockResolvedValue(mockApiResponse);

      const onSubmit = jest.fn();
      render(
        <AuthProvider>
          <SignupForm onSubmit={onSubmit} />
        </AuthProvider>
      );

      // Fill in form data
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: mockSignupData.email } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: mockSignupData.password } });
      fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: mockSignupData.confirmPassword } });

      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

      await waitFor(() => {
        expect(mockAuthAPI.signUp).toHaveBeenCalledWith(mockSignupData);
        expect(localStorage.getItem('auth_token')).toBe('test-access-token');
      });
    });

    it('should handle signup error', async () => {
      const mockSignupData: SignUpData = {
        email: 'test@example.com',
        password: 'ValidPass123!',
        confirmPassword: 'ValidPass123!'
      };

      const mockError = new Error('User already exists');
      mockAuthAPI.signUp.mockRejectedValue(mockError);

      const onSubmit = jest.fn();
      render(
        <AuthProvider>
          <SignupForm onSubmit={onSubmit} />
        </AuthProvider>
      );

      // Fill in form data
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: mockSignupData.email } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: mockSignupData.password } });
      fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: mockSignupData.confirmPassword } });

      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

      await waitFor(() => {
        expect(mockAuthAPI.signUp).toHaveBeenCalledWith(mockSignupData);
        expect(onSubmit).toThrow(); // This will be caught and handled by the component
      });
    });
  });

  describe('Login Flow', () => {
    it('should handle successful login flow', async () => {
      const mockLoginData: AuthCredentials = {
        email: 'test@example.com',
        password: 'ValidPass123!'
      };

      const mockApiResponse = {
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        token: {
          accessToken: 'test-access-token',
          expiresIn: 3600,
          tokenType: 'Bearer'
        }
      };

      mockAuthAPI.signIn.mockResolvedValue(mockApiResponse);

      const onSubmit = jest.fn();
      render(
        <AuthProvider>
          <LoginForm onSubmit={onSubmit} />
        </AuthProvider>
      );

      // Fill in form data
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: mockLoginData.email } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: mockLoginData.password } });

      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(mockAuthAPI.signIn).toHaveBeenCalledWith(mockLoginData);
        expect(localStorage.getItem('auth_token')).toBe('test-access-token');
      });
    });

    it('should handle login error', async () => {
      const mockLoginData: AuthCredentials = {
        email: 'test@example.com',
        password: 'wrong-password'
      };

      const mockError = new Error('Invalid credentials');
      mockAuthAPI.signIn.mockRejectedValue(mockError);

      const onSubmit = jest.fn();
      render(
        <AuthProvider>
          <LoginForm onSubmit={onSubmit} />
        </AuthProvider>
      );

      // Fill in form data
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: mockLoginData.email } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: mockLoginData.password } });

      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(mockAuthAPI.signIn).toHaveBeenCalledWith(mockLoginData);
      });
    });
  });

  describe('Authentication Context Integration', () => {
    it('should maintain authentication state across components', async () => {
      const TestComponent = () => {
        const { isAuthenticated, user } = useAuth();
        return (
          <div>
            <span data-testid="is-auth">{isAuthenticated.toString()}</span>
            {user && <span data-testid="user-email">{user.email}</span>}
          </div>
        );
      };

      const mockApiResponse = {
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        token: {
          accessToken: 'test-access-token',
          expiresIn: 3600,
          tokenType: 'Bearer'
        }
      };

      mockAuthAPI.signIn.mockResolvedValue(mockApiResponse);

      render(
        <AuthProvider>
          <LoginForm onSubmit={jest.fn()} />
          <TestComponent />
        </AuthProvider>
      );

      // Initially not authenticated
      expect(screen.getByTestId('is-auth')).toHaveTextContent('false');

      // Simulate login
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'ValidPass123!' } });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      // Wait for authentication state to update
      await waitFor(() => {
        expect(screen.getByTestId('is-auth')).toHaveTextContent('true');
      });
    });
  });

  describe('Protected Route Behavior', () => {
    it('should allow access when authenticated', async () => {
      // Mock token verification to return true
      mockAuthAPI.verifyToken.mockResolvedValue(true);

      // Set a mock token in localStorage
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: jest.fn(() => 'mock-token'),
          setItem: jest.fn(),
          removeItem: jest.fn(),
        },
        writable: true,
      });

      const TestProtectedComponent = () => <div data-testid="protected-content">Protected Content</div>;

      render(
        <AuthProvider>
          <ProtectedRoute>
            <TestProtectedComponent />
          </ProtectedRoute>
        </AuthProvider>
      );

      // Wait for authentication check
      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      });
    });

    it('should redirect when not authenticated', async () => {
      // Mock token verification to return false
      mockAuthAPI.verifyToken.mockResolvedValue(false);

      // Ensure no token in localStorage
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: jest.fn(() => null),
          setItem: jest.fn(),
          removeItem: jest.fn(),
        },
        writable: true,
      });

      const TestProtectedComponent = () => <div data-testid="protected-content">Protected Content</div>;

      render(
        <AuthProvider>
          <ProtectedRoute fallback={<div data-testid="fallback">Redirecting...</div>}>
            <TestProtectedComponent />
          </ProtectedRoute>
        </AuthProvider>
      );

      // Should show fallback initially while checking auth status
      expect(screen.getByTestId('fallback')).toBeInTheDocument();
    });
  });
});