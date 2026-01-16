"""
Test suite for User Story 3: Consistent Security Implementation.

This module contains acceptance tests for consistent authentication
behavior across multiple endpoints.
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


def test_multiple_endpoints_consistent_authentication_behavior():
    """T040 [US3] Test multiple endpoints exhibit consistent authentication behavior."""
    client = TestClient(app)
    token = create_test_token()

    # Test multiple protected endpoints with valid token - should all return 200
    endpoints = [
        "/api/protected-test",
        "/api/user-info"
    ]

    for endpoint in endpoints:
        response = client.get(
            endpoint,
            headers={"Authorization": f"Bearer {token}"}
        )
        # Valid token should work on all protected endpoints
        assert response.status_code == 200, f"Valid token should work on {endpoint}"


def test_valid_jwt_allows_access_various_endpoints():
    """T041 [US3] Test valid JWT allows access to various protected endpoints."""
    client = TestClient(app)
    token = create_test_token(user_id="multi_endpoint_user", email="multi@endpoint.com")

    # Test that valid token works on multiple endpoints
    response1 = client.get(
        "/api/protected-test",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response1.status_code == 200
    data1 = response1.json()
    assert data1["user_id"] == "multi_endpoint_user"

    response2 = client.get(
        "/api/user-info",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response2.status_code == 200
    data2 = response2.json()
    assert data2["user_id"] == "multi_endpoint_user"


def test_invalid_jwt_returns_401_consistently_across_endpoints():
    """T042 [US3] Test invalid JWT returns 401 consistently across endpoints."""
    client = TestClient(app)
    invalid_token = "invalid.token.string"

    # Test that invalid token returns 401 on all protected endpoints
    endpoints = [
        "/api/protected-test",
        "/api/user-info"
    ]

    for endpoint in endpoints:
        response = client.get(
            endpoint,
            headers={"Authorization": f"Bearer {invalid_token}"}
        )
        # Invalid token should return 401 on all protected endpoints
        assert response.status_code == 401, f"Invalid token should return 401 on {endpoint}"
        assert "detail" in response.json()


def test_missing_token_returns_401_consistently():
    """Test that missing token returns 401 consistently across endpoints."""
    client = TestClient(app)

    # Test that missing token returns 401 on all protected endpoints
    endpoints = [
        "/api/protected-test",
        "/api/user-info"
    ]

    for endpoint in endpoints:
        response = client.get(endpoint)  # No Authorization header
        # Missing token should return 401 on all protected endpoints
        assert response.status_code == 401, f"Missing token should return 401 on {endpoint}"
        assert "detail" in response.json()


def test_expired_token_returns_401_consistently():
    """Test that expired token returns 401 consistently across endpoints."""
    client = TestClient(app)
    expired_token = create_test_token(expires_delta=timedelta(minutes=-5))  # Expired 5 mins ago

    # Test that expired token returns 401 on all protected endpoints
    endpoints = [
        "/api/protected-test",
        "/api/user-info"
    ]

    for endpoint in endpoints:
        response = client.get(
            endpoint,
            headers={"Authorization": f"Bearer {expired_token}"}
        )
        # Expired token should return 401 on all protected endpoints
        assert response.status_code == 401, f"Expired token should return 401 on {endpoint}"
        assert "detail" in response.json()