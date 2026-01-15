// frontend/src/lib/auth/security-utils.ts

/**
 * Sanitize user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove potentially dangerous characters
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate email format to prevent injection attacks
 */
export const isValidEmail = (email: string): boolean => {
  if (typeof email !== 'string') {
    return false;
  }

  // More comprehensive email validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const isStrongPassword = (password: string): boolean => {
  if (typeof password !== 'string') {
    return false;
  }

  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
};

/**
 * Secure token storage using localStorage with additional protections
 */
export const secureTokenStorage = {
  setItem: (key: string, value: string): void => {
    // In a real application, we'd want to consider httpOnly cookies for better security
    // For now, we'll add basic protections to localStorage
    if (typeof Storage !== 'undefined') {
      // Sanitize the key
      const sanitizedKey = sanitizeInput(key);
      localStorage.setItem(sanitizedKey, value);
    }
  },

  getItem: (key: string): string | null => {
    if (typeof Storage !== 'undefined') {
      const sanitizedKey = sanitizeInput(key);
      return localStorage.getItem(sanitizedKey);
    }
    return null;
  },

  removeItem: (key: string): void => {
    if (typeof Storage !== 'undefined') {
      const sanitizedKey = sanitizeInput(key);
      localStorage.removeItem(sanitizedKey);
    }
  }
};

/**
 * Check if running in a secure context (HTTPS)
 */
export const isSecureContext = (): boolean => {
  return typeof window !== 'undefined' &&
         (window.location.protocol === 'https:' ||
          window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1');
};

/**
 * Generate a random string for CSRF tokens
 */
export const generateCsrfToken = (): string => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Fallback for older browsers (less secure)
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
};