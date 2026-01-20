"""
Base authorization test suite for the Todo API.

This module contains tests for validating the authorization system
and user-level data isolation functionality.
"""

import pytest
from fastapi.testclient import TestClient
from datetime import datetime, timedelta
from jose import jwt
import os
from backend.src.main import app
from backend.src.database.session import get_session
from backend.src.models.task import Task, TaskCreate


# Get the secret key from environment variables
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


@pytest.fixture
def client():
    """Create a test client for the FastAPI app."""
    with TestClient(app) as c:
        yield c


def test_user_can_access_their_own_tasks(client):
    """T020 [US1] Test authenticated user can access their own tasks via GET /api/{my_user_id}/tasks"""
    token = create_test_token(user_id="user1")

    response = client.get(
        "/api/user1/tasks",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_user_cannot_access_other_users_tasks_list(client):
    """T021 [US1] Test authenticated user receives 404 when accessing another user's task list via GET /api/{other_user_id}/tasks"""
    token = create_test_token(user_id="user1")

    # Try to access user2's tasks while authenticated as user1
    response = client.get(
        "/api/user2/tasks",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 404


def test_user_can_create_tasks_for_themselves(client):
    """T030 [US2] Test authenticated user can create tasks for their own user_id via POST /api/{my_user_id}/tasks"""
    token = create_test_token(user_id="user1")

    task_data = {
        "title": "Test Task",
        "description": "Test Description",
        "completed": False
    }

    response = client.post(
        "/api/user1/tasks",
        json=task_data,
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Task"
    assert data["user_id"] == "user1"


def test_user_can_update_their_own_tasks(client):
    """T031 [US2] Test authenticated user can update their own tasks via PUT /api/{my_user_id}/tasks/{my_task_id}"""
    token = create_test_token(user_id="user1")

    # First create a task
    task_data = {
        "title": "Original Task",
        "description": "Original Description",
        "completed": False
    }

    create_response = client.post(
        "/api/user1/tasks",
        json=task_data,
        headers={"Authorization": f"Bearer {token}"}
    )

    assert create_response.status_code == 201
    created_task = create_response.json()
    task_id = created_task["id"]

    # Now update the task
    update_data = {
        "title": "Updated Task",
        "description": "Updated Description",
        "completed": True
    }

    response = client.put(
        f"/api/user1/tasks/{task_id}",
        json=update_data,
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Task"
    assert data["completed"] is True


def test_user_cannot_update_another_users_task(client):
    """T032 [US2] Test authenticated user receives 404 when attempting to update another user's task via PUT /api/{other_user_id}/tasks/{my_task_id}"""
    token1 = create_test_token(user_id="user1")
    token2 = create_test_token(user_id="user2")

    # Create a task as user2
    task_data = {
        "title": "User2's Task",
        "description": "User2's Description",
        "completed": False
    }

    create_response = client.post(
        "/api/user2/tasks",
        json=task_data,
        headers={"Authorization": f"Bearer {token2}"}
    )

    assert create_response.status_code == 201
    created_task = create_response.json()
    task_id = created_task["id"]

    # Try to update user2's task as user1
    update_data = {
        "title": "Hacked Task",
        "description": "Hacked Description",
        "completed": True
    }

    response = client.put(
        f"/api/user2/tasks/{task_id}",
        json=update_data,
        headers={"Authorization": f"Bearer {token1}"}
    )

    assert response.status_code == 404


def test_user_can_toggle_their_own_task_completion(client):
    """T040 [US3] Test authenticated user can toggle their own task completion via PATCH /api/{my_user_id}/tasks/{my_task_id}/complete"""
    token = create_test_token(user_id="user1")

    # First create a task
    task_data = {
        "title": "Toggle Task",
        "description": "Toggle Description",
        "completed": False
    }

    create_response = client.post(
        "/api/user1/tasks",
        json=task_data,
        headers={"Authorization": f"Bearer {token}"}
    )

    assert create_response.status_code == 201
    created_task = create_response.json()
    task_id = created_task["id"]

    # Toggle the task completion status
    response = client.patch(
        f"/api/user1/tasks/{task_id}/complete",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    # The completion status should be toggled (was False, now True)
    assert data["completed"] is True


def test_user_cannot_toggle_another_users_task(client):
    """T041 [US3] Test authenticated user receives 404 when attempting to toggle another user's task via PATCH /api/{other_user_id}/tasks/{my_task_id}/complete"""
    token1 = create_test_token(user_id="user1")
    token2 = create_test_token(user_id="user2")

    # Create a task as user2
    task_data = {
        "title": "User2's Task",
        "description": "User2's Description",
        "completed": False
    }

    create_response = client.post(
        "/api/user2/tasks",
        json=task_data,
        headers={"Authorization": f"Bearer {token2}"}
    )

    assert create_response.status_code == 201
    created_task = create_response.json()
    task_id = created_task["id"]

    # Try to toggle user2's task as user1
    response = client.patch(
        f"/api/user2/tasks/{task_id}/complete",
        headers={"Authorization": f"Bearer {token1}"}
    )

    assert response.status_code == 404


def test_url_user_id_must_match_jwt_user_id(client):
    """T054 Add validation that URL user_id matches JWT user_id for all task endpoints"""
    token = create_test_token(user_id="user1")

    # Try to access user2's tasks while having JWT for user1
    response = client.get(
        "/api/user2/tasks",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 404

    # Same for POST
    task_data = {"title": "Test", "description": "Test", "completed": False}
    response = client.post(
        "/api/user2/tasks",
        json=task_data,
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 404