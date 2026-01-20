from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid
from .base import UserOwnedBase, generate_uuid


class TaskBase(UserOwnedBase):
    title: str = Field(min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, max_length=500)
    completed: bool = Field(default=False)


class Task(TaskBase, table=True):
    """
    Task model representing a todo item with all required fields
    """
    id: Optional[str] = Field(default_factory=generate_uuid, primary_key=True, max_length=36)
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)


class TaskCreate(TaskBase):
    """
    Model for creating a new task (without id and timestamps)
    """
    title: str = Field(min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, max_length=500)
    completed: bool = Field(default=False)