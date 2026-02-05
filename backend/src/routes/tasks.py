from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List
from uuid import UUID
from ..database.session import get_session
from ..models.task_model import TaskCreate
from ..schemas.task_schemas import TaskResponse, TaskUpdate, TaskListResponse
from ..services.task_service import (
    create_task,
    get_tasks_by_user,
    get_task_by_id_and_user,
    update_task_by_id_and_user,
    delete_task_by_id_and_user
)
from ..utils.uuid_generator import is_valid_uuid
from ..middleware.jwt_middleware import get_current_user, TokenData
from ..utils.errors import unauthorized_error, forbidden_error, not_found_error, validation_error

router = APIRouter(prefix="/api", tags=["tasks"])


@router.post("/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task_endpoint(
    task_data: TaskCreate,
    current_user: TokenData = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Create a new task for the authenticated user

    Args:
        task_data: Task creation data
        current_user: The authenticated user from JWT token
        session: Database session

    Returns:
        Created task with 201 status code
    """
    try:
        # Use user_id from JWT token instead of URL parameter
        # The task_data is already validated by Pydantic via TaskCreate model
        return create_task(session, task_data, current_user.user_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create task: {str(e)}"
        )


@router.get("/tasks", response_model=List[TaskResponse])
def get_tasks_endpoint(
    current_user: TokenData = Depends(get_current_user),
    offset: int = 0,
    limit: int = 50,
    session: Session = Depends(get_session)
):
    """
    Get all tasks for the authenticated user with pagination

    Args:
        current_user: The authenticated user from JWT token
        offset: Pagination offset
        limit: Pagination limit (max 100)
        session: Database session

    Returns:
        List of tasks for the authenticated user
    """
    # Validate pagination parameters
    if offset < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Offset must be non-negative"
        )

    if limit < 1 or limit > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Limit must be between 1 and 100"
        )

    try:
        # Use user_id from JWT token instead of URL parameter
        tasks = get_tasks_by_user(session, current_user.user_id, offset, limit)
        return tasks
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve tasks: {str(e)}"
        )


@router.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task_endpoint(
    task_id: str,
    current_user: TokenData = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Get a specific task by its ID

    Args:
        task_id: ID of the task to retrieve
        current_user: The authenticated user from JWT token
        session: Database session

    Returns:
        The requested task
    """
    # Validate UUID formats
    if not is_valid_uuid(task_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid task ID format"
        )

    try:
        # Use user_id from JWT token instead of URL parameter
        task = get_task_by_id_and_user(session, task_id, current_user.user_id)

        if not task:
            raise not_found_error("Task not found or not owned by user")

        return task
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve task: {str(e)}"
        )


@router.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task_endpoint(
    task_id: str,
    task_update: TaskUpdate,
    current_user: TokenData = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Update a specific task by its ID

    Args:
        task_id: ID of the task to update
        task_update: Update data
        current_user: The authenticated user from JWT token
        session: Database session

    Returns:
        Updated task
    """
    # Validate UUID formats
    if not is_valid_uuid(task_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid task ID format"
        )

    try:
        # Use user_id from JWT token instead of URL parameter
        # The task_update is already validated by Pydantic via TaskUpdate model
        updated_task = update_task_by_id_and_user(session, task_id, current_user.user_id, task_update)

        if not updated_task:
            raise not_found_error("Task not found or not owned by user")

        return updated_task
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update task: {str(e)}"
        )


@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task_endpoint(
    task_id: str,
    current_user: TokenData = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Delete a specific task by its ID

    Args:
        task_id: ID of the task to delete
        current_user: The authenticated user from JWT token
        session: Database session

    Returns:
        204 No Content if successful
    """
    # Validate UUID formats
    if not is_valid_uuid(task_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid task ID format"
        )

    try:
        # Use user_id from JWT token instead of URL parameter
        deleted = delete_task_by_id_and_user(session, task_id, current_user.user_id)

        if not deleted:
            raise not_found_error("Task not found or not owned by user")

        # Return 204 No Content on successful deletion
        return
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete task: {str(e)}"
        )


@router.patch("/tasks/{task_id}", response_model=TaskResponse)
def toggle_task_completion_endpoint(
    task_id: str,
    task_update: TaskUpdate,
    current_user: TokenData = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Toggle task completion status by updating the completed field

    Args:
        task_id: ID of the task to update
        task_update: Update data (specifically the completed field)
        current_user: The authenticated user from JWT token
        session: Database session

    Returns:
        Updated task with new completion status
    """
    # Validate UUID format
    if not is_valid_uuid(task_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid task ID format"
        )

    try:
        # Use user_id from JWT token instead of URL parameter
        # The task_update is already validated by Pydantic via TaskUpdate model
        updated_task = update_task_by_id_and_user(session, task_id, current_user.user_id, task_update)

        if not updated_task:
            raise not_found_error("Task not found or not owned by user")

        return updated_task
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update task: {str(e)}"
        )