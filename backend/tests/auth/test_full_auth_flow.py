"""
Full integration test for the JWT authentication system.

This module tests the complete authentication flow and validates
that all components work together correctly.
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


def create_test_token(user_id: str = "integration_test_user", email: str = "integration@test.com", expires_delta: timedelta = None):
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


def test_full_auth_system_integration():
    """T058 Run full test suite to ensure all functionality works together."""
    client = TestClient(app)

    # 1. Test that protected endpoints require authentication
    response = client.get("/api/protected-test")
    assert response.status_code == 401  # Unauthorized without token

    # 2. Test that valid token grants access
    valid_token = create_test_token()
    response = client.get(
        "/api/protected-test",
        headers={"Authorization": f"Bearer {valid_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == "integration_test_user"
    assert data["email"] == "integration@test.com"

    # 3. Test that invalid token returns 401
    response = client.get(
        "/api/protected-test",
        headers={"Authorization": "Bearer invalid.token.here"}
    )
    assert response.status_code == 401

    # 4. Test that expired token returns 401
    expired_token = create_test_token(expires_delta=timedelta(minutes=-10))
    response = client.get(
        "/api/protected-test",
        headers={"Authorization": f"Bearer {expired_token}"}
    )
    assert response.status_code == 401

    # 5. Test another protected endpoint for consistency
    response = client.get(
        "/api/user-info",
        headers={"Authorization": f"Bearer {valid_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == "integration_test_user"
    assert data["email"] == "integration@test.com"
    assert data["authenticated"] is True

    # 6. Test that missing email in token causes failure
    # Create a token without email (required claim)
    expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode = {
        "user_id": "test_user_no_email",
        # Missing email field intentionally
        "exp": expire.timestamp(),
        "iat": datetime.utcnow().timestamp()
    }
    token_without_email = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    response = client.get(
        "/api/protected-test",
        headers={"Authorization": f"Bearer {token_without_email}"}
    )
    assert response.status_code == 401  # Should fail due to missing required claim

    print("All integration tests passed!")


def test_performance_validation():
    """T053 Validate performance: JWT validation completes within 100ms (per SC-003, SC-004)."""
    import time
    from backend.src.auth.jwt import verify_jwt_token

    token = create_test_token()

    # Measure the time it takes to verify a token
    start_time = time.time()
    for _ in range(100):  # Test multiple verifications
        payload = verify_jwt_token(token)
        assert payload is not None
    end_time = time.time()

    avg_time_per_verification = ((end_time - start_time) / 100) * 1000  # Convert to milliseconds
    assert avg_time_per_verification < 100, f"Average verification time {avg_time_per_verification:.2f}ms exceeds 100ms threshold"
    print(f"Average JWT verification time: {avg_time_per_verification:.2f}ms")


def test_environment_variable_validation():
    """T054 Add environment variable validation for BETTER_AUTH_SECRET."""
    secret = os.getenv("BETTER_AUTH_SECRET")
    assert secret is not None and secret != "", "BETTER_AUTH_SECRET must be set in environment"
    assert len(secret) >= 32, "BETTER_AUTH_SECRET should be a strong secret (at least 32 characters recommended)"
    print("Environment variable validation passed!")


def test_stateless_operation():
    """T057 Validate stateless operation (no session storage)."""
    # The JWT implementation is stateless by design - no server-side session storage
    # We can verify this by checking that the same token works multiple times
    client = TestClient(app)
    token = create_test_token(user_id="stateless_test", email="stateless@test.com")

    # Make multiple requests with the same token - should all succeed
    for i in range(5):
        response = client.get(
            "/api/user-info",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["user_id"] == "stateless_test"

    print("Stateless operation validated!")


def test_better_auth_compatibility():
    """T056 Test compatibility with Better Auth JWT token format."""
    # Create a token that mimics the format expected from Better Auth
    token = create_test_token(user_id="better_auth_user", email="better_auth@test.com")

    # Verify that our system can process this token
    from backend.src.auth.jwt import verify_jwt_token, extract_user_identity, validate_required_claims

    payload = verify_jwt_token(token)
    assert payload is not None, "Token should be verifiable"

    user_identity = extract_user_identity(payload)
    assert user_identity is not None, "User identity should be extractable"
    assert user_identity["user_id"] == "better_auth_user"
    assert user_identity["email"] == "better_auth@test.com"

    has_claims = validate_required_claims(payload)
    assert has_claims is True, "Token should have required claims"

    print("Better Auth compatibility validated!")


if __name__ == "__main__":
    test_full_auth_system_integration()
    test_performance_validation()
    test_environment_variable_validation()
    test_stateless_operation()
    test_better_auth_compatibility()
    print("All full auth flow tests passed!")