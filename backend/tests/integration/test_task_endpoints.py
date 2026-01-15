import pytest
from fastapi.testclient import TestClient
from backend.src.main import app
from backend.src.models.task_model import Task
from backend.src.services.task_service import create_task, get_tasks_by_user
from sqlmodel import Session
from unittest.mock import patch
import json


def test_create_task_endpoint():
    """Test the POST /api/{user_id}/tasks endpoint"""
    client = TestClient(app)

    user_id = "123e4567-e89b-12d3-a456-426614174000"
    task_data = {
        "title": "Test Task",
        "description": "Test Description",
        "completed": False
    }

    response = client.post(f"/api/{user_id}/tasks", json=task_data)

    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Task"
    assert data["description"] == "Test Description"
    assert data["completed"] is False
    assert data["user_id"] == user_id
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data


def test_create_task_endpoint_missing_title():
    """Test that creating a task without a title fails"""
    client = TestClient(app)

    user_id = "123e4567-e89b-12d3-a456-426614174000"
    task_data = {
        "description": "Test Description",
        "completed": False
    }

    response = client.post(f"/api/{user_id}/tasks", json=task_data)

    assert response.status_code == 422  # Unprocessable entity due to validation


def test_get_tasks_endpoint():
    """Test the GET /api/{user_id}/tasks endpoint"""
    client = TestClient(app)

    user_id = "123e4567-e89b-12d3-a456-426614174000"

    # First create a task
    task_data = {
        "title": "Test Task",
        "description": "Test Description",
        "completed": False
    }
    create_response = client.post(f"/api/{user_id}/tasks", json=task_data)
    assert create_response.status_code == 201

    # Now get the tasks
    response = client.get(f"/api/{user_id}/tasks")

    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    # Find our created task in the response
    created_task = next((t for t in data if t["title"] == "Test Task"), None)
    assert created_task is not None
    assert created_task["user_id"] == user_id


def test_get_specific_task_endpoint():
    """Test the GET /api/{user_id}/tasks/{task_id} endpoint"""
    client = TestClient(app)

    user_id = "123e4567-e89b-12d3-a456-426614174000"

    # First create a task
    task_data = {
        "title": "Test Task",
        "description": "Test Description",
        "completed": False
    }
    create_response = client.post(f"/api/{user_id}/tasks", json=task_data)
    assert create_response.status_code == 201
    created_task = create_response.json()
    task_id = created_task["id"]

    # Now get the specific task
    response = client.get(f"/api/{user_id}/tasks/{task_id}")

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == task_id
    assert data["title"] == "Test Task"
    assert data["user_id"] == user_id


def test_update_task_endpoint():
    """Test the PUT /api/{user_id}/tasks/{task_id} endpoint"""
    client = TestClient(app)

    user_id = "123e4567-e89b-12d3-a456-426614174000"

    # First create a task
    task_data = {
        "title": "Original Task",
        "description": "Original Description",
        "completed": False
    }
    create_response = client.post(f"/api/{user_id}/tasks", json=task_data)
    assert create_response.status_code == 201
    created_task = create_response.json()
    task_id = created_task["id"]

    # Now update the task
    update_data = {
        "title": "Updated Task",
        "description": "Updated Description",
        "completed": True
    }
    response = client.put(f"/api/{user_id}/tasks/{task_id}", json=update_data)

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == task_id
    assert data["title"] == "Updated Task"
    assert data["description"] == "Updated Description"
    assert data["completed"] is True


def test_delete_task_endpoint():
    """Test the DELETE /api/{user_id}/tasks/{task_id} endpoint"""
    client = TestClient(app)

    user_id = "123e4567-e89b-12d3-a456-426614174000"

    # First create a task
    task_data = {
        "title": "Task to Delete",
        "description": "Description",
        "completed": False
    }
    create_response = client.post(f"/api/{user_id}/tasks", json=task_data)
    assert create_response.status_code == 201
    created_task = create_response.json()
    task_id = created_task["id"]

    # Now delete the task
    response = client.delete(f"/api/{user_id}/tasks/{task_id}")

    assert response.status_code == 204  # No content

    # Verify the task is gone
    get_response = client.get(f"/api/{user_id}/tasks/{task_id}")
    assert get_response.status_code == 404


def test_invalid_user_id_format():
    """Test that invalid user ID formats return 400"""
    client = TestClient(app)

    invalid_user_id = "invalid-uuid"
    task_data = {
        "title": "Test Task",
        "description": "Test Description",
        "completed": False
    }

    response = client.post(f"/api/{invalid_user_id}/tasks", json=task_data)

    assert response.status_code == 400


def test_invalid_task_id_format():
    """Test that invalid task ID formats return 400"""
    client = TestClient(app)

    user_id = "123e4567-e89b-12d3-a456-426614174000"
    invalid_task_id = "invalid-uuid"

    response = client.get(f"/api/{user_id}/tasks/{invalid_task_id}")

    assert response.status_code == 400