"""
Protected API routes for the Todo application.

This module defines API endpoints that require JWT authentication.
"""

from fastapi import APIRouter, Depends
from backend.src.models.auth import AuthenticatedUser
from backend.src.auth.dependencies import get_current_user


router = APIRouter()


@router.get("/protected-test")
async def protected_endpoint(current_user: AuthenticatedUser = Depends(get_current_user)):
    """
    A sample protected endpoint that requires JWT authentication.

    This endpoint demonstrates how to protect routes using the JWT authentication
    dependency. Only authenticated users can access this endpoint.

    Args:
        current_user: The authenticated user, automatically extracted from JWT token

    Returns:
        A message including user information
    """
    return {
        "message": f"Hello {current_user.email}, you are successfully authenticated!",
        "user_id": current_user.user_id,
        "email": current_user.email
    }


@router.get("/user-info")
async def get_user_info(current_user: AuthenticatedUser = Depends(get_current_user)):
    """
    Endpoint to get information about the currently authenticated user.

    Args:
        current_user: The authenticated user, automatically extracted from JWT token

    Returns:
        User information including ID and email
    """
    return {
        "user_id": current_user.user_id,
        "email": current_user.email,
        "authenticated": True
    }