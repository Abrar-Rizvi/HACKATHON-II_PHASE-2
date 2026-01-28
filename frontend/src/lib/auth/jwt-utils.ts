// frontend/src/lib/auth/jwt-utils.ts

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

// For our implementation, we're using simple JWT validation without server-side verification
// In a production app, you'd want to call a backend endpoint to verify the token
export const verifyToken = async (token: string) => {
  try {
    // Simple validation - check if token has correct format and hasn't expired
    if (!token) return false;

    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const payload = decodeToken(token);
    if (!payload) return false;

    const currentTime = Math.floor(Date.now() / 1000);

    return payload.exp > currentTime;
  } catch (error) {
    console.error("Token verification failed:", error);
    return false;
  }
};