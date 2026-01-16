"""
Test suite for JWT utilities in the Todo application backend.

This module contains tests for the JWT utility functions including
token verification, format validation, and user identity extraction.
"""

import os
import pytest
from datetime import datetime, timedelta
from jose import jwt
from backend.src.auth.jwt import (
    verify_jwt_token,
    validate_token_format,
    extract_user_identity,
    is_token_expired,
    validate_required_claims
)


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


def test_verify_jwt_token_valid():
    """Test that a valid JWT token is verified successfully."""
    token = create_test_token()

    payload = verify_jwt_token(token)

    assert payload is not None
    assert payload["user_id"] == "test_user"
    assert payload["email"] == "test@example.com"


def test_verify_jwt_token_invalid_signature():
    """Test that a JWT token with invalid signature fails verification."""
    # Create a token with a different secret to simulate invalid signature
    wrong_secret = "wrong_secret_key"
    to_encode = {
        "user_id": "test_user",
        "email": "test@example.com",
        "exp": (datetime.utcnow() + timedelta(minutes=15)).timestamp()
    }
    wrong_token = jwt.encode(to_encode, wrong_secret, algorithm=ALGORITHM)

    payload = verify_jwt_token(wrong_token)

    assert payload is None


def test_verify_jwt_token_expired():
    """Test that an expired JWT token fails verification."""
    expired_token = create_test_token(expires_delta=timedelta(minutes=-5))

    payload = verify_jwt_token(expired_token)

    assert payload is None


def test_validate_token_format_valid():
    """Test that a valid JWT token format passes validation."""
    token = create_test_token()

    is_valid = validate_token_format(token)

    assert is_valid is True


def test_validate_token_format_invalid():
    """Test that an invalid JWT token format fails validation."""
    invalid_token = "invalid.token.format.with.wrong.parts.count"

    is_valid = validate_token_format(invalid_token)

    assert is_valid is False


def test_extract_user_identity_success():
    """Test that user identity is extracted correctly from a valid payload."""
    payload = {
        "user_id": "test_user",
        "email": "test@example.com",
        "exp": (datetime.utcnow() + timedelta(minutes=15)).timestamp(),
        "iat": datetime.utcnow().timestamp()
    }

    user_identity = extract_user_identity(payload)

    assert user_identity is not None
    assert user_identity["user_id"] == "test_user"
    assert user_identity["email"] == "test@example.com"


def test_extract_user_identity_missing_fields():
    """Test that None is returned when required fields are missing."""
    payload = {
        "user_id": "test_user",
        # Missing email
        "exp": (datetime.utcnow() + timedelta(minutes=15)).timestamp()
    }

    user_identity = extract_user_identity(payload)

    assert user_identity is None


def test_is_token_expired_true():
    """Test that is_token_expired returns True for an expired token."""
    expired_payload = {
        "exp": (datetime.utcnow() - timedelta(minutes=5)).timestamp()
    }

    expired = is_token_expired(expired_payload)

    assert expired is True


def test_is_token_expired_false():
    """Test that is_token_expired returns False for a valid token."""
    valid_payload = {
        "exp": (datetime.utcnow() + timedelta(minutes=15)).timestamp()
    }

    expired = is_token_expired(valid_payload)

    assert expired is False


def test_validate_required_claims_success():
    """Test that validate_required_claims returns True when all claims are present."""
    payload = {
        "user_id": "test_user",
        "email": "test@example.com"
    }

    valid = validate_required_claims(payload)

    assert valid is True


def test_validate_required_claims_missing():
    """Test that validate_required_claims returns False when required claims are missing."""
    payload = {
        "user_id": "test_user",
        # Missing email
    }

    valid = validate_required_claims(payload)

    assert valid is False


if __name__ == "__main__":
    pytest.main([__file__])