from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from werkzeug.security import generate_password_hash
from .base import BaseSQLModel


class UserBase(SQLModel):
    email: str = Field(unique=True, nullable=False, max_length=100)
    username: str = Field(unique=True, nullable=False, max_length=50)


class User(UserBase, table=True):
    """
    User model for authentication
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str = Field(nullable=False)
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True)


class UserCreate(UserBase):
    """
    Model for creating a new user
    """
    password: str = Field(min_length=6, max_length=100)


class UserRead(UserBase):
    """
    Model for returning user data (without password)
    """
    id: int
    created_at: datetime
    updated_at: datetime
    is_active: bool