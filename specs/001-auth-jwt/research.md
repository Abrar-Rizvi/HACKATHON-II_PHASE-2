# Research: Authentication System with Better Auth and JWT

## Decision: JWT Payload Fields - Minimal vs Extended

**Rationale**: For the authentication system, we chose a minimal JWT payload containing only essential fields to reduce token size and improve performance while maintaining security. The JWT will contain:
- user_id: Unique identifier for the authenticated user
- email: User's email address for identification
- exp: Expiration timestamp for automatic logout
- iat: Issued at timestamp for tracking token age

**Alternatives considered**:
- Extended payload with roles, permissions, profile data: Increases token size and reduces performance
- Claims for additional user attributes: Creates privacy concerns and increases token size

## Decision: Token Storage Strategy - httpOnly Cookies

**Rationale**: Using httpOnly cookies for JWT storage provides the highest security against XSS attacks since the tokens are inaccessible to JavaScript. This approach prevents malicious scripts from stealing authentication tokens while still allowing the browser to automatically send the token with requests to the backend.

**Alternatives considered**:
- localStorage: Vulnerable to XSS attacks as JavaScript can access stored tokens
- sessionStorage: Same XSS vulnerability as localStorage
- Memory storage: Lost on page refresh, requiring additional complexity

## Decision: Token Expiry Duration - 7 Days

**Rationale**: A 7-day expiry provides a good balance between user convenience (not having to log in daily) and security (limiting the window of opportunity if a token is compromised). This duration can be adjusted based on security requirements.

**Alternatives considered**:
- Short-lived (1-2 hours): More secure but requires frequent re-authentication, degrading user experience
- Long-lived (30+ days): Less secure as compromised tokens remain valid for extended periods

## Decision: Environment Secret Handling - BETTER_AUTH_SECRET

**Rationale**: The BETTER_AUTH_SECRET will be managed through environment variables in accordance with the project constitution. This ensures the secret is not hardcoded in the source code and can be configured differently for different environments (development, staging, production).

**Implementation approach**:
- Use NEXT_PUBLIC_BETTER_AUTH_URL for the public URL
- Use BETTER_AUTH_SECRET for the server-side secret
- Store secrets in .env.local files that are git-ignored
- Document the required environment variables in quickstart.md