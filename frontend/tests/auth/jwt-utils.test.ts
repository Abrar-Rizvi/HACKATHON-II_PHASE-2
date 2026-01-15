// frontend/tests/auth/jwt-utils.test.ts
import { verifyToken, decodeToken, isTokenExpired } from '../../src/lib/auth/jwt-utils';

// Mock the environment variable
process.env.BETTER_AUTH_SECRET = 'test-secret-for-jest-tests';

describe('JWT Utilities', () => {
  const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.49FzqlFdQtnH27DBrqIXgGg6KSyJABJEps0pe3SkOm4'; // Expired token

  describe('verifyToken', () => {
    it('should verify a valid token', async () => {
      const result = await verifyToken(validToken);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('sub');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('iat');
      expect(result).toHaveProperty('exp');
    });

    it('should return null for an invalid token', async () => {
      const invalidToken = 'invalid.token.format';
      const result = await verifyToken(invalidToken);
      expect(result).toBeNull();
    });

    it('should return null for a token with wrong signature', async () => {
      // This token has a different signature
      const wrongSignatureToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.different_signature';
      const result = await verifyToken(wrongSignatureToken);
      expect(result).toBeNull();
    });
  });

  describe('decodeToken', () => {
    it('should decode a valid token', () => {
      const result = decodeToken(validToken);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('sub');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('iat');
      expect(result).toHaveProperty('exp');
    });

    it('should return null for an invalid token', () => {
      const invalidToken = 'invalid.token.format';
      const result = decodeToken(invalidToken);
      expect(result).toBeNull();
    });

    it('should return null for a token with wrong format', () => {
      const malformedToken = 'invalid.token';
      const result = decodeToken(malformedToken);
      expect(result).toBeNull();
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for a valid token', () => {
      const result = isTokenExpired(validToken);
      expect(result).toBe(false);
    });

    it('should return true for an expired token', () => {
      const result = isTokenExpired(expiredToken);
      expect(result).toBe(true);
    });

    it('should return true for an invalid token', () => {
      const invalidToken = 'invalid.token.format';
      const result = isTokenExpired(invalidToken);
      expect(result).toBe(true);
    });

    it('should return true for a token without exp field', () => {
      // Token without exp field
      const tokenWithoutExp = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      const result = isTokenExpired(tokenWithoutExp);
      expect(result).toBe(true);
    });
  });

  describe('integration', () => {
    it('should verify and decode the same token consistently', async () => {
      const result = await verifyToken(validToken);
      const decoded = decodeToken(validToken);

      expect(result).toBeDefined();
      expect(decoded).toBeDefined();
      expect(result.sub).toEqual(decoded.sub);
      expect(result.name).toEqual(decoded.name);
    });
  });
});