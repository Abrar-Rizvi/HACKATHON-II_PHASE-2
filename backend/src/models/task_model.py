from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid
from ..utils.uuid_generator import generate_uuid


class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, max_length=500)
    completed: Optional[bool] = Field(default=False)


class TaskCreate(SQLModel):
    """
    Model for creating a new task (without id and user_id - these are set by the backend)
    """
    title: str = Field(min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, max_length=500)
    completed: Optional[bool] = Field(default=False)


class Task(TaskBase, table=True):
    """
    Task model representing a todo item with all required fields
    """
    id: Optional[str] = Field(default_factory=generate_uuid, primary_key=True, max_length=36)
    user_id: str = Field(max_length=36)  # UUID as string
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)