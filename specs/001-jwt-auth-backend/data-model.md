# Data Model: JWT Authentication for FastAPI Backend

## Overview
This document defines the data structures and models related to JWT authentication for the FastAPI backend, based on the feature specification requirements.

## Core Entities

### 1. JWT Token
**Description**: Represents an authentication token issued by Better Auth
**Fields**:
- `token` (string): The JWT token string received in Authorization header
- `header` (dict): Decoded JWT header containing algorithm and token type
- `payload` (dict): Decoded JWT payload containing user identity and metadata
- `signature` (bytes): The cryptographic signature portion of the JWT

**Validation Rules**:
- Must follow standard JWT format (header.payload.signature)
- Signature must be verifiable with BETTER_AUTH_SECRET
- Must contain required claims (user_id, email)

### 2. Authenticated User Context
**Description**: Runtime context object containing validated user identity for route handlers
**Fields**:
- `user_id` (string): Unique identifier for the authenticated user (UUID format)
- `email` (string): Email address associated with the authenticated user
- `expires_at` (datetime): Timestamp when the token expires
- `issued_at` (datetime): Timestamp when the token was issued
- `is_valid` (bool): Whether the token has passed all validation checks

**Validation Rules**:
- user_id must be present and non-empty
- email must be a valid email format
- expires_at must be in the future
- is_valid must be True for authenticated requests

### 3. JWT Verification Result
**Description**: Container for the outcome of JWT validation process
**Fields**:
- `success` (bool): Whether the validation was successful
- `user_context` (Authenticated User Context): Validated user data when success=True
- `error_message` (string): Description of the validation failure when success=False
- `error_code` (string): Standardized error code for the type of failure

**Validation Rules**:
- When success is True, user_context must be populated and error fields empty
- When success is False, error_message and error_code must be populated

## State Transitions

### JWT Token Validation Flow
```
Incoming Request with Authorization Header
    ↓
Token Extraction (Bearer <token>)
    ↓
Format Validation (JWT structure)
    ↓
Signature Verification (using BETTER_AUTH_SECRET)
    ↓
Expiration Check (current_time < expires_at)
    ↓
Payload Validation (contains required claims)
    ↓
Authenticated User Context Creation
```

## API Contract Models

### 1. AuthenticatedUser (Pydantic Model)
Used in FastAPI route handlers to receive validated user context:

```python
class AuthenticatedUser(BaseModel):
    user_id: str
    email: str
    expires_at: datetime
    issued_at: datetime
```

### 2. JWTVerificationError (Pydantic Model)
Used for standardized error responses:

```python
class JWTVerificationError(BaseModel):
    error: str
    error_code: str
    timestamp: datetime
```

## Relationships
- JWT Token → Authenticated User Context (one-to-one transformation)
- Authenticated User Context → Route Handlers (dependency injection)
- JWT Verification Result → API Responses (for error cases)

## Constraints
- All user identification must come from JWT payload, not database lookup
- Token validation must be stateless (no server-side session storage)
- All operations must complete within 100ms as per success criteria
- No sensitive data should be stored in JWT payload beyond required user identity