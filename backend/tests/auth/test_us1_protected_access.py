"""
Test suite for User Story 1: Secure API Access with JWT.

This module contains acceptance tests for the protected API endpoint,
verifying that valid JWT tokens allow access while unauthorized requests
return 401 errors.
"""

import pytest
from datetime import datetime, timedelta
from jose import jwt
import os
from fastapi.testclient import TestClient
from backend.src.main import app


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


def test_valid_jwt_token_allows_access():
    """T020 [US1] Test valid JWT token allows access to protected endpoint."""
    client = TestClient(app)
    token = create_test_token()

    response = client.get(
        "/api/protected-test",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert data["user_id"] == "test_user"
    assert data["email"] == "test@example.com"


def test_missing_authorization_header_returns_401():
    """T021 [US1] Test missing Authorization header returns 401 Unauthorized."""
    client = TestClient(app)

    response = client.get("/api/protected-test")

    assert response.status_code == 401
    data = response.json()
    assert "detail" in data


def test_invalid_token_returns_401():
    """T022 [US1] Test invalid/expired JWT token returns 401 Unauthorized."""
    client = TestClient(app)
    invalid_token = "invalid.token.string"

    response = client.get(
        "/api/protected-test",
        headers={"Authorization": f"Bearer {invalid_token}"}
    )

    assert response.status_code == 401
    data = response.json()
    assert "detail" in data


def test_expired_token_returns_401():
    """Test that an expired JWT token returns 401 Unauthorized."""
    client = TestClient(app)
    expired_token = create_test_token(expires_delta=timedelta(minutes=-5))  # Expired 5 mins ago

    response = client.get(
        "/api/protected-test",
        headers={"Authorization": f"Bearer {expired_token}"}
    )

    assert response.status_code == 401
    data = response.json()
    assert "detail" in data


def test_valid_jwt_works_on_user_info_endpoint():
    """Additional test to verify JWT works on another protected endpoint."""
    client = TestClient(app)
    token = create_test_token(user_id="another_user", email="another@example.com")

    response = client.get(
        "/api/user-info",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == "another_user"
    assert data["email"] == "another@example.com"
    assert data["authenticated"] is True