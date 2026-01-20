from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime
from ..models.task import Task, TaskCreate
from ..schemas.task_schemas import TaskResponse, TaskUpdate
from uuid import UUID


def create_task(session: Session, task_data: TaskCreate, user_id: str) -> TaskResponse:
    """
    Create a new task for a user

    Args:
        session: Database session
        task_data: Task creation data
        user_id: ID of the user creating the task

    Returns:
        Created task as TaskResponse
    """
    # Create the task object
    task = Task(
        title=task_data.title,
        description=task_data.description,
        completed=task_data.completed,
        user_id=user_id
    )

    # Add to session and commit
    session.add(task)
    session.commit()
    session.refresh(task)

    # Return as response object
    return TaskResponse(
        id=task.id,
        user_id=task.user_id,
        title=task.title,
        description=task.description,
        completed=task.completed,
        created_at=task.created_at,
        updated_at=task.updated_at
    )


def get_tasks_by_user(
    session: Session,
    user_id: str,
    offset: int = 0,
    limit: int = 50
) -> List[TaskResponse]:
    """
    Get all tasks for a specific user with pagination

    Args:
        session: Database session
        user_id: ID of the user whose tasks to retrieve
        offset: Pagination offset
        limit: Pagination limit

    Returns:
        List of tasks for the user
    """
    statement = select(Task).where(Task.user_id == user_id).offset(offset).limit(limit)
    tasks = session.exec(statement).all()

    return [
        TaskResponse(
            id=task.id,
            user_id=task.user_id,
            title=task.title,
            description=task.description,
            completed=task.completed,
            created_at=task.created_at,
            updated_at=task.updated_at
        )
        for task in tasks
    ]


def get_task_by_id_and_user(session: Session, task_id: str, user_id: str) -> Optional[TaskResponse]:
    """
    Get a specific task by its ID and user ID

    Args:
        session: Database session
        task_id: ID of the task to retrieve
        user_id: ID of the user who owns the task

    Returns:
        Task if found and owned by user, None otherwise
    """
    statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
    task = session.exec(statement).first()

    if task:
        return TaskResponse(
            id=task.id,
            user_id=task.user_id,
            title=task.title,
            description=task.description,
            completed=task.completed,
            created_at=task.created_at,
            updated_at=task.updated_at
        )
    return None


def update_task_by_id_and_user(
    session: Session,
    task_id: str,
    user_id: str,
    task_update: TaskUpdate
) -> Optional[TaskResponse]:
    """
    Update a specific task by its ID and user ID

    Args:
        session: Database session
        task_id: ID of the task to update
        user_id: ID of the user who owns the task
        task_update: Update data

    Returns:
        Updated task if found and owned by user, None otherwise
    """
    statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
    task = session.exec(statement).first()

    if not task:
        return None

    # Update the task with provided fields
    if task_update.title is not None:
        task.title = task_update.title
    if task_update.description is not None:
        task.description = task_update.description
    if task_update.completed is not None:
        task.completed = task_update.completed

    # Update the timestamp
    task.updated_at = datetime.utcnow()

    session.add(task)
    session.commit()
    session.refresh(task)

    return TaskResponse(
        id=task.id,
        user_id=task.user_id,
        title=task.title,
        description=task.description,
        completed=task.completed,
        created_at=task.created_at,
        updated_at=task.updated_at
    )


def delete_task_by_id_and_user(session: Session, task_id: str, user_id: str) -> bool:
    """
    Delete a specific task by its ID and user ID

    Args:
        session: Database session
        task_id: ID of the task to delete
        user_id: ID of the user who owns the task

    Returns:
        True if task was deleted, False if not found or not owned by user
    """
    statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
    task = session.exec(statement).first()

    if not task:
        return False

    session.delete(task)
    session.commit()
    return True


def get_all_tasks_count_for_user(session: Session, user_id: str) -> int:
    """
    Get the count of all tasks for a specific user

    Args:
        session: Database session
        user_id: ID of the user whose task count to retrieve

    Returns:
        Count of tasks for the user
    """
    from sqlalchemy import func
    statement = select(func.count(Task.id)).where(Task.user_id == user_id)
    count = session.exec(statement).one()
    return count


def get_user_tasks_with_filters(
    session: Session,
    authenticated_user_id: str,
    completed: Optional[bool] = None,
    offset: int = 0,
    limit: int = 50
) -> List[TaskResponse]:
    """
    Get tasks for authenticated user with optional filters

    Args:
        session: Database session
        authenticated_user_id: ID of the authenticated user (for authorization)
        completed: Optional filter for completed status
        offset: Pagination offset
        limit: Pagination limit

    Returns:
        List of tasks owned by the authenticated user with applied filters
    """
    query = select(Task).where(Task.user_id == authenticated_user_id)

    if completed is not None:
        query = query.where(Task.completed == completed)

    query = query.offset(offset).limit(limit)
    tasks = session.exec(query).all()

    return [
        TaskResponse(
            id=task.id,
            user_id=task.user_id,
            title=task.title,
            description=task.description,
            completed=task.completed,
            created_at=task.created_at,
            updated_at=task.updated_at
        )
        for task in tasks
    ]


def validate_task_ownership(session: Session, task_id: str, authenticated_user_id: str) -> bool:
    """
    Validate that a task belongs to the authenticated user

    Args:
        session: Database session
        task_id: ID of the task to validate ownership for
        authenticated_user_id: ID of the authenticated user

    Returns:
        True if task belongs to user, False otherwise
    """
    statement = select(Task).where(
        Task.id == task_id,
        Task.user_id == authenticated_user_id
    )
    task = session.exec(statement).first()
    return task is not None


def get_user_task_by_id(
    session: Session,
    authenticated_user_id: str,
    task_id: str
) -> Optional[TaskResponse]:
    """
    Get a specific task for the authenticated user

    Args:
        session: Database session
        authenticated_user_id: ID of the authenticated user (for authorization)
        task_id: ID of the task to retrieve

    Returns:
        Task if found and owned by user, None otherwise
    """
    statement = select(Task).where(
        Task.id == task_id,
        Task.user_id == authenticated_user_id
    )
    task = session.exec(statement).first()

    if task:
        return TaskResponse(
            id=task.id,
            user_id=task.user_id,
            title=task.title,
            description=task.description,
            completed=task.completed,
            created_at=task.created_at,
            updated_at=task.updated_at
        )
    return None