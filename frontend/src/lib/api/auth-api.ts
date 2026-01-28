// frontend/src/lib/api/auth-api.ts
import { AuthCredentials, SignUpData, LoginResponse } from '../../types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/auth';

class AuthAPI {
  async signUp(credentials: SignUpData): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
        username: credentials.username || credentials.email.split('@')[0],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Registration failed');
    }

    return response.json();
  }

  async signIn(credentials: AuthCredentials): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }

    return response.json();
  }

  async signOut(): Promise<{ message: string }> {
    // For our JWT implementation, logout is client-side only
    localStorage.removeItem('auth_token');
    return { message: 'Logged out successfully' };
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      // For our JWT implementation, we'll decode the token locally or call a verify endpoint
      // Since we don't have a verify endpoint, we'll decode locally for now
      // In a real implementation, you'd want a backend verify endpoint
      if (!token) return false;

      // Simple JWT validation - check if token has correct format and hasn't expired
      try {
        const parts = token.split('.');
        if (parts.length !== 3) return false;

        const payload = JSON.parse(atob(parts[1]));
        const currentTime = Math.floor(Date.now() / 1000);

        return payload.exp > currentTime;
      } catch (e) {
        return false;
      }
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  }
}

export const authAPI = new AuthAPI();