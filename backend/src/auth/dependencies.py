"""
FastAPI dependencies for authentication in the Todo application.

This module provides dependency functions that can be used to enforce
JWT authentication on API endpoints and extract user identity.
"""

from typing import Dict, Any
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from .jwt import verify_jwt_token, extract_user_identity, validate_required_claims
from ..models.auth import AuthenticatedUser


security = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> AuthenticatedUser:
    """
    FastAPI dependency to get the current authenticated user from JWT token.

    This function extracts the JWT token from the Authorization header,
    validates it, and returns an AuthenticatedUser object with user identity.

    Args:
        credentials: The HTTP authorization credentials from the request header

    Returns:
        AuthenticatedUser object containing user identity information

    Raises:
        HTTPException: If the token is invalid, expired, or missing required claims
    """
    token = credentials.credentials

    # Verify the JWT token
    payload = verify_jwt_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Validate that required claims exist in the payload
    if not validate_required_claims(payload):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing required claims",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Extract user identity from the payload
    user_identity = extract_user_identity(payload)
    if user_identity is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not extract user identity from token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create and return an AuthenticatedUser object
    return AuthenticatedUser(
        user_id=user_identity["user_id"],
        email=user_identity["email"],
        expires_at=user_identity["expires_at"],
        issued_at=user_identity["issued_at"],
    )


def get_token_payload(request: Request) -> Dict[str, Any]:
    """
    Extract and return the JWT token payload from the request.

    This is a lower-level function that just extracts and verifies the token
    without creating an AuthenticatedUser object.

    Args:
        request: The incoming FastAPI request

    Returns:
        Dictionary containing the token payload

    Raises:
        HTTPException: If no token is present or if the token is invalid
    """
    authorization_header = request.headers.get("Authorization")
    if not authorization_header:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header is missing",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Check if the header has the correct format: "Bearer <token>"
    if not authorization_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header must start with 'Bearer '",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Extract the token part
    token = authorization_header[len("Bearer "):]

    # Verify the JWT token
    payload = verify_jwt_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return payload