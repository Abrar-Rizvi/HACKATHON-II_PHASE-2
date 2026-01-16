# JWT Authentication Module

This module provides JWT-based authentication functionality for the Todo application backend.

## Components

### 1. JWT Utilities (`jwt.py`)
Provides low-level functions for:
- Token verification and signature validation
- Expiration checking
- Payload decoding
- User identity extraction

### 2. Authentication Dependencies (`dependencies.py`)
Provides FastAPI dependency functions:
- `get_current_user`: Extracts user identity from JWT token
- `get_token_payload`: Gets raw token payload (lower-level)

### 3. Authentication Models (`models/auth.py`)
Pydantic models for:
- `AuthenticatedUser`: Contains user identity information
- `JWTVerificationError`: Standardized error responses

## How to Protect Endpoints

To protect an endpoint with JWT authentication, use the `get_current_user` dependency:

```python
from fastapi import Depends
from backend.src.models.auth import AuthenticatedUser
from backend.src.auth.dependencies import get_current_user

@router.get("/my-protected-endpoint")
async def my_endpoint(current_user: AuthenticatedUser = Depends(get_current_user)):
    # current_user contains user_id, email, and other identity info
    return {
        "message": f"Hello {current_user.email}",
        "user_id": current_user.user_id
    }
```

## Requirements

- JWT tokens must be provided in the `Authorization` header as `Bearer <token>`
- Tokens must contain `user_id` and `email` claims
- Tokens must be signed with the `BETTER_AUTH_SECRET`

## Error Handling

Authentication failures return HTTP 401 Unauthorized with appropriate error messages.

## Testing

Include the JWT token in your test requests:

```python
response = client.get(
    "/protected-endpoint",
    headers={"Authorization": f"Bearer {valid_token}"}
)
```