// frontend/src/types/auth.ts
export interface User {
  id: number;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpData extends AuthCredentials {
  username: string;
  confirmPassword: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  expires_at: string;
}

export interface JWTToken {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signUp: (credentials: SignUpData) => Promise<void>;
  signIn: (credentials: AuthCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  verifyToken: (token: string) => Promise<boolean>;
}