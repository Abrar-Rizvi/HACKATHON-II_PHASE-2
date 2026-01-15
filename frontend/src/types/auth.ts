// frontend/src/types/auth.ts
export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface JWTToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: string;
}

export interface SignUpData extends AuthCredentials {
  confirmPassword: string;
}

export interface LoginResponse {
  user: User;
  token: JWTToken;
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