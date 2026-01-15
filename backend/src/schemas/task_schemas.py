from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class TaskCreate(BaseModel):
    """
    Schema for creating a new task
    """
    title: str = Field(..., min_length=1, max_length=100, description="Task title")
    description: Optional[str] = Field(None, max_length=500, description="Optional task description")
    completed: Optional[bool] = Field(False, description="Whether the task is completed")


class TaskUpdate(BaseModel):
    """
    Schema for updating an existing task
    """
    title: Optional[str] = Field(None, min_length=1, max_length=100, description="Task title")
    description: Optional[str] = Field(None, max_length=500, description="Optional task description")
    completed: Optional[bool] = Field(None, description="Whether the task is completed")


class TaskResponse(BaseModel):
    """
    Schema for task response
    """
    id: str
    user_id: str
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: datetime


class TaskListResponse(BaseModel):
    """
    Schema for task list response
    """
    tasks: list[TaskResponse]


class TaskUpdateResponse(BaseModel):
    """
    Schema for task update response
    """
    id: str
    user_id: str
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: datetime