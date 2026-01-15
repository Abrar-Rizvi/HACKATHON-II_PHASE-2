import pytest
from backend.src.models.task_model import Task, TaskCreate
from datetime import datetime
from uuid import UUID


def test_task_creation():
    """Test creating a Task instance"""
    task_data = {
        "title": "Test Task",
        "description": "Test Description",
        "completed": False,
        "user_id": "123e4567-e89b-12d3-a456-426614174000"
    }

    task = Task(**task_data)

    assert task.title == "Test Task"
    assert task.description == "Test Description"
    assert task.completed == False
    assert task.user_id == "123e4567-e89b-12d3-a456-426614174000"
    assert task.id is not None  # Auto-generated
    assert isinstance(task.created_at, datetime)
    assert isinstance(task.updated_at, datetime)


def test_task_create_schema():
    """Test creating a TaskCreate instance"""
    task_create = TaskCreate(
        title="Test Task",
        description="Test Description",
        completed=False
    )

    assert task_create.title == "Test Task"
    assert task_create.description == "Test Description"
    assert task_create.completed == False


def test_task_create_required_fields():
    """Test that required fields are validated in TaskCreate"""
    # Test that title is required
    with pytest.raises(ValueError):
        TaskCreate(title="", description="Test Description")


def test_task_create_title_length_validation():
    """Test title length validation"""
    # Test that title is at least 1 character
    with pytest.raises(ValueError):
        TaskCreate(title="", description="Test Description")

    # Test that title doesn't exceed 100 characters
    long_title = "a" * 101
    with pytest.raises(ValueError):
        TaskCreate(title=long_title, description="Test Description")

    # Test that a valid title length works
    valid_title = "a" * 100
    task_create = TaskCreate(title=valid_title, description="Test Description")
    assert task_create.title == valid_title


def test_task_create_description_length_validation():
    """Test description length validation"""
    # Test that description doesn't exceed 500 characters
    long_description = "a" * 501
    with pytest.raises(ValueError):
        TaskCreate(title="Test Task", description=long_description)

    # Test that a valid description length works
    valid_description = "a" * 500
    task_create = TaskCreate(title="Test Task", description=valid_description)
    assert task_create.description == valid_description