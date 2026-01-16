"""
JWT utility functions for authentication in the Todo application.

This module provides functions for validating JWT tokens issued by Better Auth,
including signature verification, expiration checking, and payload decoding.
"""

import os
from datetime import datetime
from typing import Dict, Any, Optional
from jose import JWTError, jwt
from fastapi import HTTPException, status


# Get the secret key from environment variables
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")
if not SECRET_KEY:
    raise ValueError("BETTER_AUTH_SECRET environment variable is not set")

ALGORITHM = "HS256"


def verify_jwt_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verify a JWT token and return its payload if valid.

    Args:
        token: The JWT token string to verify

    Returns:
        Dictionary containing the token payload if valid, None otherwise
    """
    try:
        # Decode the token using the secret key and specified algorithm
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        # Check if the token has expired
        exp = payload.get("exp")
        if exp and datetime.fromtimestamp(exp) < datetime.utcnow():
            return None  # Token has expired

        return payload
    except JWTError:
        # Token is invalid (wrong signature, malformed, etc.)
        return None


def validate_token_format(token: str) -> bool:
    """
    Validate the basic format of a JWT token.

    Args:
        token: The JWT token string to validate

    Returns:
        True if the token has a valid JWT format, False otherwise
    """
    try:
        # Check if token has the correct number of parts (header.payload.signature)
        parts = token.split(".")
        if len(parts) != 3:
            return False

        # Try to decode the header and payload to ensure they're valid base64
        for part in parts[:2]:  # Only check header and payload, not signature
            # Add padding if needed
            padded_part = part + "=" * ((4 - len(part) % 4) % 4)
            import base64
            base64.b64decode(padded_part)

        return True
    except Exception:
        return False


def extract_user_identity(payload: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Extract user identity information from a JWT payload.

    Args:
        payload: The decoded JWT payload dictionary

    Returns:
        Dictionary with user identity info (user_id, email) if present, None otherwise
    """
    user_id = payload.get("user_id")
    email = payload.get("email")

    # Both user_id and email should be present in a valid auth token
    if user_id and email:
        return {
            "user_id": user_id,
            "email": email,
            "expires_at": datetime.fromtimestamp(payload.get("exp", 0)) if payload.get("exp") else None,
            "issued_at": datetime.fromtimestamp(payload.get("iat", 0)) if payload.get("iat") else None,
        }

    return None


def is_token_expired(payload: Dict[str, Any]) -> bool:
    """
    Check if a JWT token has expired.

    Args:
        payload: The decoded JWT payload dictionary

    Returns:
        True if the token has expired, False otherwise
    """
    exp = payload.get("exp")
    if not exp:
        return True  # If no expiration is set, consider it expired

    return datetime.fromtimestamp(exp) < datetime.utcnow()


def validate_required_claims(payload: Dict[str, Any]) -> bool:
    """
    Validate that required claims exist in the JWT payload.

    Args:
        payload: The decoded JWT payload dictionary

    Returns:
        True if all required claims are present, False otherwise
    """
    required_claims = ["user_id", "email"]
    for claim in required_claims:
        if claim not in payload or not payload[claim]:
            return False
    return True