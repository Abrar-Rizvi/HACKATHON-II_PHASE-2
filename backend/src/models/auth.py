"""
Pydantic models for authentication in the Todo application.

This module defines the data models used for authentication purposes,
including the AuthenticatedUser model and JWT verification error model.
"""

from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class AuthenticatedUser(BaseModel):
    """
    Model representing an authenticated user with identity information.

    This model is returned by the authentication dependency and provides
    user identity information to route handlers.
    """

    user_id: str
    email: str
    expires_at: Optional[datetime] = None
    issued_at: Optional[datetime] = None

    class Config:
        """Pydantic configuration for the AuthenticatedUser model."""
        from_attributes = True


class JWTVerificationError(BaseModel):
    """
    Model representing an error during JWT verification.

    This model is used for standardized error responses when JWT validation fails.
    """

    error: str
    error_code: str
    timestamp: datetime = datetime.now()

    class Config:
        """Pydantic configuration for the JWTVerificationError model."""
        from_attributes = True