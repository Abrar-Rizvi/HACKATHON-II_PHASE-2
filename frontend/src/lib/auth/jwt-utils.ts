// frontend/src/lib/auth/jwt-utils.ts
import { jwtVerify, createRemoteJWKSet } from "jose";

const getSecretKey = () => {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) {
    throw new Error("BETTER_AUTH_SECRET is not configured");
  }
  return new TextEncoder().encode(secret);
};

export const verifyToken = async (token: string) => {
  try {
    const verified = await jwtVerify(token, getSecretKey());
    return verified.payload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};

export const decodeToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Token decoding failed:", error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true; // Consider invalid tokens as expired
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};