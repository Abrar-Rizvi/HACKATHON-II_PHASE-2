# Quickstart Guide: User-Level Authorization for Todo API

## Overview
This guide provides a quick introduction to implementing and using user-level data isolation and task ownership enforcement in the Todo API.

## Prerequisites
- Completed JWT authentication implementation (Spec-3)
- Python 3.10+
- FastAPI framework
- SQLModel for database operations
- Valid BETTER_AUTH_SECRET environment variable

## Core Components

### 1. Authorization Service Layer
Location: `backend/src/services/task.py`

Contains functions for:
- User-scoped task retrieval
- Ownership validation during CRUD operations
- Consistent error handling for unauthorized access

### 2. Route-Level Authorization
Location: `backend/src/routes/tasks.py`

Provides:
- Validation of URL user_id against JWT user_id
- Integration with service layer authorization
- Proper error responses (404 for unauthorized access)

### 3. ORM-Level Filtering
Location: `backend/src/models/task.py`

Ensures:
- All database queries are filtered by user_id
- Protection at the database level
- Efficient querying with reduced data transfer

## Implementation Pattern

### Basic Authorization Pattern
```python
from fastapi import Depends
from sqlmodel import Session, select
from backend.src.models.task import Task
from backend.src.auth.dependencies import get_current_user
from backend.src.database import get_session

def get_user_tasks(
    session: Session,
    current_user_id: str
):
    """Retrieve only tasks belonging to the authenticated user."""
    tasks = session.exec(
        select(Task).where(Task.user_id == current_user_id)
    ).all()
    return tasks

def get_user_task_by_id(
    session: Session,
    current_user_id: str,
    task_id: str
):
    """Retrieve a specific task only if it belongs to the authenticated user."""
    task = session.exec(
        select(Task).where(
            Task.user_id == current_user_id,
            Task.id == task_id
        )
    ).first()
    return task

async def get_tasks_endpoint(
    user_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Validate that URL user_id matches JWT user_id
    if user_id != current_user.user_id:
        raise HTTPException(status_code=404, detail="Resource not found")

    # Retrieve user's tasks only
    tasks = get_user_tasks(session, current_user.user_id)
    return tasks
```

## Testing

### Unit Tests
Located in: `backend/tests/task/`

Run with:
```bash
pytest backend/tests/task/
```

### Authorization Tests
```python
# Test that users can access their own tasks
def test_user_can_access_own_tasks():
    # Implementation verifies user can access tasks with matching user_id

# Test that users cannot access others' tasks
def test_user_cannot_access_other_users_tasks():
    # Implementation verifies 404 response for cross-user access attempts

# Test that URL user_id must match JWT user_id
def test_url_user_id_must_match_jwt_user_id():
    # Implementation verifies validation between URL and JWT
```

## Security Notes
- Always validate URL user_id against JWT user_id
- Return 404 (not 403) for unauthorized access to prevent information leakage
- Filter all database queries by user_id to prevent data leakage
- Validate user_id format and presence in both JWT and URL
- Ensure all error messages don't reveal resource existence