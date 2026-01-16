"""
Test suite for authentication dependencies in the Todo application backend.

This module contains tests for the FastAPI authentication dependencies,
including the get_current_user function and token payload extraction.
"""

import os
import pytest
from datetime import datetime, timedelta
from unittest.mock import Mock, patch
from jose import jwt
from fastapi import HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials

from backend.src.auth.dependencies import get_current_user, get_token_payload
from backend.src.models.auth import AuthenticatedUser


# Set up test constants
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")
ALGORITHM = "HS256"


def create_test_token(user_id: str = "test_user", email: str = "test@example.com", expires_delta: timedelta = None):
    """Helper function to create a test JWT token."""
    if expires_delta is None:
        expires_delta = timedelta(minutes=15)  # Default to 15 minutes

    expire = datetime.utcnow() + expires_delta
    to_encode = {
        "user_id": user_id,
        "email": email,
        "exp": expire.timestamp(),
        "iat": datetime.utcnow().timestamp()
    }
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def test_get_current_user_valid_token():
    """Test that get_current_user returns an AuthenticatedUser with valid token."""
    token = create_test_token()
    credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)

    with patch('backend.src.auth.dependencies.verify_jwt_token', return_value={
        "user_id": "test_user",
        "email": "test@example.com",
        "exp": (datetime.utcnow() + timedelta(minutes=15)).timestamp(),
        "iat": datetime.utcnow().timestamp()
    }), \
         patch('backend.src.auth.dependencies.validate_required_claims', return_value=True), \
         patch('backend.src.auth.dependencies.extract_user_identity', return_value={
             "user_id": "test_user",
             "email": "test@example.com",
             "expires_at": datetime.utcnow() + timedelta(minutes=15),
             "issued_at": datetime.utcnow()
         }):

        user = get_current_user(credentials)

        assert isinstance(user, AuthenticatedUser)
        assert user.user_id == "test_user"
        assert user.email == "test@example.com"


def test_get_current_user_invalid_token():
    """Test that get_current_user raises HTTPException for invalid token."""
    token = "invalid_token"
    credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)

    with patch('backend.src.auth.dependencies.verify_jwt_token', return_value=None):
        with pytest.raises(HTTPException) as exc_info:
            get_current_user(credentials)

        assert exc_info.value.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Invalid or expired token" in exc_info.value.detail


def test_get_current_user_missing_claims():
    """Test that get_current_user raises HTTPException when required claims are missing."""
    token = create_test_token()
    credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)

    with patch('backend.src.auth.dependencies.verify_jwt_token', return_value={
        "user_id": "test_user",
        "exp": (datetime.utcnow() + timedelta(minutes=15)).timestamp(),
        # Missing email
    }), \
         patch('backend.src.auth.dependencies.validate_required_claims', return_value=False):

        with pytest.raises(HTTPException) as exc_info:
            get_current_user(credentials)

        assert exc_info.value.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Token missing required claims" in exc_info.value.detail


def test_get_current_user_no_email():
    """Test that get_current_user raises HTTPException when email is missing from payload."""
    token = create_test_token()
    credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)

    with patch('backend.src.auth.dependencies.verify_jwt_token', return_value={
        "user_id": "test_user",
        "email": "",  # Empty email
        "exp": (datetime.utcnow() + timedelta(minutes=15)).timestamp(),
        "iat": datetime.utcnow().timestamp()
    }), \
         patch('backend.src.auth.dependencies.validate_required_claims', return_value=False):

        with pytest.raises(HTTPException) as exc_info:
            get_current_user(credentials)

        assert exc_info.value.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Token missing required claims" in exc_info.value.detail


def test_get_token_payload_valid():
    """Test that get_token_payload returns the token payload for a valid token."""
    token = create_test_token()

    # Create a mock request object
    mock_request = Mock()
    mock_request.headers = {"Authorization": f"Bearer {token}"}

    with patch('backend.src.auth.dependencies.verify_jwt_token', return_value={
        "user_id": "test_user",
        "email": "test@example.com",
        "exp": (datetime.utcnow() + timedelta(minutes=15)).timestamp(),
        "iat": datetime.utcnow().timestamp()
    }):

        payload = get_token_payload(mock_request)

        assert payload["user_id"] == "test_user"
        assert payload["email"] == "test@example.com"


def test_get_token_payload_missing_header():
    """Test that get_token_payload raises HTTPException when Authorization header is missing."""
    # Create a mock request object with no Authorization header
    mock_request = Mock()
    mock_request.headers = {}

    with pytest.raises(HTTPException) as exc_info:
        get_token_payload(mock_request)

    assert exc_info.value.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Authorization header is missing" in exc_info.value.detail


def test_get_token_payload_invalid_format():
    """Test that get_token_payload raises HTTPException for invalid Authorization header format."""
    # Create a mock request object with invalid Authorization header format
    mock_request = Mock()
    mock_request.headers = {"Authorization": "InvalidFormat"}

    with pytest.raises(HTTPException) as exc_info:
        get_token_payload(mock_request)

    assert exc_info.value.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Authorization header must start with 'Bearer '" in exc_info.value.detail


def test_get_token_payload_invalid_token():
    """Test that get_token_payload raises HTTPException for invalid token."""
    # Create a mock request object
    mock_request = Mock()
    mock_request.headers = {"Authorization": "Bearer invalid_token"}

    with patch('backend.src.auth.dependencies.verify_jwt_token', return_value=None):
        with pytest.raises(HTTPException) as exc_info:
            get_token_payload(mock_request)

        assert exc_info.value.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Invalid or expired token" in exc_info.value.detail


if __name__ == "__main__":
    pytest.main([__file__])