/**
 * User type definition with all required fields
 */
export interface User {
  id: string;
  email: string;
  name?: string | null;
}

/**
 * User session entity with JWT token management
 */
export interface UserSession {
  user: User | null;
  jwtToken: string | null;
  expiresAt: Date | string | null;
  isLoggedIn: boolean;
}

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Register request payload
 */
export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

/**
 * Login response
 */
export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

/**
 * Register response
 */
export interface RegisterResponse {
  success: boolean;
  token: string;
  user: User;
}