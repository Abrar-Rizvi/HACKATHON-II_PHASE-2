"""
Pydantic models for authorization validation in the Todo API.

This module defines the data models used for authorization and validation purposes,
including the TaskOwnershipValidation model and AuthorizationError model.
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TaskOwnershipValidation(BaseModel):
    """
    Model for validating task ownership between JWT token and task record.

    This model is used in service layer to validate ownership before performing operations.
    """
    user_id_from_token: str
    user_id_from_url: str
    task_owner_id: str
    is_valid: bool
    error_code: Optional[str] = None

    class Config:
        """Pydantic configuration for the TaskOwnershipValidation model."""
        from_attributes = True


class AuthorizationError(BaseModel):
    """
    Model representing an error during authorization validation.

    This model is used for standardized error responses when authorization fails.
    """
    error: str
    error_code: str
    timestamp: datetime = datetime.now()

    class Config:
        """Pydantic configuration for the AuthorizationError model."""
        from_attributes = True