# Research: JWT Authentication Implementation for FastAPI

## Overview
This research document addresses the key decisions and technical considerations for implementing JWT-based authentication in the FastAPI backend, following the feature specification for securing API endpoints with Better Auth JWT tokens.

## Decision Points Identified from Feature Requirements

### 1. Middleware vs Dependency Injection Approach

**Decision**: Dependency injection approach using FastAPI Depends() rather than middleware
**Rationale**:
- Provides more granular control over which endpoints require authentication
- Allows authenticated user context to be injected directly into route handlers
- Better integration with FastAPI's type hinting and OpenAPI documentation
- More flexible than global middleware for mixed protected/public endpoints

**Alternatives considered**:
- Global middleware: Would apply to all routes uniformly, less flexible
- Route decorator approach: Less idiomatic for FastAPI ecosystem

### 2. JWT Library Selection

**Decision**: Use `python-jose[cryptography]` library
**Rationale**:
- Well-maintained and actively developed
- Compatible with Better Auth JWT signing
- Good integration with Python async frameworks
- Supports the algorithms typically used by Better Auth (RS256, HS256)
- Good security track record

**Alternatives considered**:
- `PyJWT`: More basic, requires additional packages for crypto operations
- `cryptography`: Lower-level, more complex to implement JWT verification

### 3. Error Handling Strategy

**Decision**: Return HTTP 401 Unauthorized for all authentication failures
**Rationale**:
- Aligns with feature specification requirement (FR-005)
- Follows RESTful API conventions for authentication failures
- Simple and consistent error handling
- Prevents information leakage about valid vs invalid tokens

**Alternatives considered**:
- Different error codes for different failure types: Could leak information about token validity

### 4. Token Payload Contract Assumptions

**Decision**: Expect JWT payload to contain `user_id` and `email` claims
**Rationale**:
- Aligns with feature specification (FR-004, FR-006)
- Matches typical Better Auth JWT structure
- Enables downstream authorization based on user identity
- Follows common JWT best practices

**Payload structure expected**:
```json
{
  "user_id": "uuid-string",
  "email": "user@example.com",
  "exp": 1234567890,
  "iat": 1234567890,
  "iss": "better-auth"
}
```

### 5. Authorization Header Parsing

**Decision**: Extract JWT from "Authorization: Bearer [token]" header format
**Rationale**:
- Standard approach for JWT authentication
- Aligns with feature specification (FR-001)
- Compatible with common HTTP clients and API documentation
- Follows RFC 6750 (Bearer Token specification)

## Architecture Sketch

```
Request → Authorization Header → JWT Decode → Signature Verification → Expiry Check → User Context Injection → Route Handler
```

## Key Implementation Components

1. **JWT Utility Functions**:
   - Token parsing and validation
   - Signature verification using BETTER_AUTH_SECRET
   - Expiration checking
   - Payload decoding

2. **FastAPI Dependency**:
   - Extracts token from Authorization header
   - Validates token using JWT utilities
   - Returns authenticated user context

3. **Environment Configuration**:
   - BETTER_AUTH_SECRET loading
   - JWT algorithm configuration

## Integration Considerations

- FastAPI's OpenAPI/Swagger documentation will automatically reflect security requirements when using Depends()
- Compatibility with Better Auth token issuance system
- Stateless operation (no session storage)
- Performance optimization for sub-100ms validation (per SC-003, SC-004)