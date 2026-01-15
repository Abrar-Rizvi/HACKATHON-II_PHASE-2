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

router = APIRouter(prefix="/api/{user_id}", tags=["tasks"])


@router.post("/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task_endpoint(
    user_id: str,
    task_data: TaskCreate,
    session: Session = Depends(get_session)
):
    """
    Create a new task for a user

    Args:
        user_id: ID of the user creating the task
        task_data: Task creation data
        session: Database session

    Returns:
        Created task with 201 status code
    """
    # Validate UUID format
    if not is_valid_uuid(user_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format"
        )

    # Validate title length
    if len(task_data.title) < 1 or len(task_data.title) > 100:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Title must be between 1 and 100 characters"
        )

    # Validate description length
    if task_data.description and len(task_data.description) > 500:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Description must be at most 500 characters"
        )

    try:
        return create_task(session, task_data, user_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create task: {str(e)}"
        )


@router.get("/tasks", response_model=List[TaskResponse])
def get_tasks_endpoint(
    user_id: str,
    offset: int = 0,
    limit: int = 50,
    session: Session = Depends(get_session)
):
    """
    Get all tasks for a user with pagination

    Args:
        user_id: ID of the user whose tasks to retrieve
        offset: Pagination offset
        limit: Pagination limit (max 100)
        session: Database session

    Returns:
        List of tasks for the user
    """
    # Validate UUID format
    if not is_valid_uuid(user_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format"
        )

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
        tasks = get_tasks_by_user(session, user_id, offset, limit)
        return tasks
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve tasks: {str(e)}"
        )


@router.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task_endpoint(
    user_id: str,
    task_id: str,
    session: Session = Depends(get_session)
):
    """
    Get a specific task by its ID

    Args:
        user_id: ID of the user who owns the task
        task_id: ID of the task to retrieve
        session: Database session

    Returns:
        The requested task
    """
    # Validate UUID formats
    if not is_valid_uuid(user_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format"
        )

    if not is_valid_uuid(task_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid task ID format"
        )

    try:
        task = get_task_by_id_and_user(session, task_id, user_id)

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found or not owned by user"
            )

        return task
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve task: {str(e)}"
        )


@router.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task_endpoint(
    user_id: str,
    task_id: str,
    task_update: TaskUpdate,
    session: Session = Depends(get_session)
):
    """
    Update a specific task by its ID

    Args:
        user_id: ID of the user who owns the task
        task_id: ID of the task to update
        task_update: Update data
        session: Database session

    Returns:
        Updated task
    """
    # Validate UUID formats
    if not is_valid_uuid(user_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format"
        )

    if not is_valid_uuid(task_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid task ID format"
        )

    # Validate title length if provided
    if task_update.title is not None:
        if len(task_update.title) < 1 or len(task_update.title) > 100:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Title must be between 1 and 100 characters"
            )

    # Validate description length if provided
    if task_update.description is not None and len(task_update.description) > 500:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Description must be at most 500 characters"
        )

    try:
        updated_task = update_task_by_id_and_user(session, task_id, user_id, task_update)

        if not updated_task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found or not owned by user"
            )

        return updated_task
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update task: {str(e)}"
        )


@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task_endpoint(
    user_id: str,
    task_id: str,
    session: Session = Depends(get_session)
):
    """
    Delete a specific task by its ID

    Args:
        user_id: ID of the user who owns the task
        task_id: ID of the task to delete
        session: Database session

    Returns:
        204 No Content if successful
    """
    # Validate UUID formats
    if not is_valid_uuid(user_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format"
        )

    if not is_valid_uuid(task_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid task ID format"
        )

    try:
        deleted = delete_task_by_id_and_user(session, task_id, user_id)

        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found or not owned by user"
            )

        # Return 204 No Content on successful deletion
        return
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete task: {str(e)}"
        )