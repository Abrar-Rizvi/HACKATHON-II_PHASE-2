# Quickstart: Authentication System Implementation

## Prerequisites

- Node.js 18+ installed
- Next.js 16+ project initialized
- Better Auth package installed

## Installation

1. Install Better Auth and related dependencies:

```bash
npm install better-auth @better-auth/react
```

2. Install JWT utilities:

```bash
npm install jsonwebtoken jose
```

## Environment Variables

Create a `.env.local` file in your frontend directory with the following:

```env
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3001
BETTER_AUTH_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
```

## Configuration

1. Create the Better Auth client configuration at `frontend/src/lib/auth/better-auth-client.ts`:

```typescript
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3001",
  // Additional configuration options
});
```

2. Set up JWT utilities at `frontend/src/lib/auth/jwt-utils.ts`:

```typescript
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
```

## Implementation Steps

1. Create authentication provider at `frontend/src/components/auth/AuthProvider.tsx`
2. Implement signup form at `frontend/src/components/auth/SignupForm.tsx`
3. Implement login form at `frontend/src/components/auth/LoginForm.tsx`
4. Create authentication context at `frontend/src/lib/auth/auth-context.tsx`
5. Add authentication pages in Next.js App Router
6. Implement authentication hook at `frontend/src/hooks/useAuth.ts`

## Running Tests

```bash
npm run test:auth
```

## Next Steps

After implementing the basic authentication system, you can:
- Integrate with the backend API for protected routes
- Add social login providers
- Implement password reset functionality
- Add multi-factor authentication