# Quickstart Guide: JWT Authentication for FastAPI Backend

## Overview
This guide provides a quick introduction to implementing and using JWT-based authentication in the FastAPI backend.

## Prerequisites
- Python 3.10+
- FastAPI framework
- Better Auth configured for token issuance
- BETTER_AUTH_SECRET environment variable set

## Setup

### 1. Install Dependencies
```bash
pip install python-jose[cryptography] python-multipart
```

### 2. Configure Environment Variables
```bash
export BETTER_AUTH_SECRET="your-secret-key-here"
export JWT_ALGORITHM="HS256"  # or "RS256" depending on Better Auth configuration
```

## Core Components

### 1. JWT Verification Utility
Location: `backend/src/auth/jwt.py`

Contains functions for:
- Token validation and signature verification
- Expiration checking
- Payload extraction

### 2. Authentication Dependency
Location: `backend/src/auth/dependencies.py`

Provides a FastAPI dependency that:
- Extracts JWT from Authorization header
- Validates the token
- Returns authenticated user context

### 3. Usage in Route Handlers
```python
from fastapi import Depends
from backend.src.auth.dependencies import get_current_user
from backend.src.models.auth import AuthenticatedUser

@app.get("/protected-endpoint")
async def protected_route(current_user: AuthenticatedUser = Depends(get_current_user)):
    # current_user contains validated user_id and email
    return {"message": f"Hello {current_user.email}"}
```

## Testing

### Unit Tests
Located in: `backend/tests/auth/`

Run with:
```bash
pytest backend/tests/auth/
```

### Manual Testing
```bash
# Valid token request
curl -H "Authorization: Bearer <valid-jwt-token>" http://localhost:8000/protected-endpoint

# Invalid token request (should return 401)
curl -H "Authorization: Bearer <invalid-jwt-token>" http://localhost:8000/protected-endpoint

# Missing token request (should return 401)
curl http://localhost:8000/protected-endpoint
```

## Security Notes
- Never store JWT secrets in source code
- Use HTTPS in production
- Tokens are validated statelessly with no server-side session storage
- All protected endpoints require valid JWT tokens