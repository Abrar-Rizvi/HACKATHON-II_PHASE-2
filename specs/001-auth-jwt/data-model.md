# Data Model: Authentication System

## Entities

### User
Represents an authenticated user of the todo application with email and password credentials.

**Fields**:
- id: UUID (primary identifier)
- email: String (unique, validated format)
- createdAt: Timestamp (account creation date)
- updatedAt: Timestamp (last account update)

**Validation Rules**:
- Email must follow standard email format (e.g., user@example.com)
- Email must be unique across all users
- Password must meet strength requirements (minimum length, complexity)

**State Transitions**:
- Unregistered → Registered (upon successful signup)
- Registered → Authenticated (upon successful login)
- Authenticated → Unauthenticated (upon logout or token expiry)

### JWT Token
A secure token containing user identity information with expiration time.

**Fields**:
- user_id: UUID (reference to User.id)
- email: String (copy of user's email)
- exp: Integer (Unix timestamp for expiration)
- iat: Integer (Unix timestamp for issue time)
- jti: String (JWT ID for potential revocation)

**Validation Rules**:
- Token must be signed with BETTER_AUTH_SECRET
- Token must not be expired (exp > current time)
- Token signature must be valid

**State Transitions**:
- Issued → Active (valid token in use)
- Active → Expired (token past expiration time)
- Active → Revoked (manually invalidated by user/logout)

## Relationships

- One User to Many JWT Tokens (user can have multiple active sessions)
- JWT Token references User via user_id field