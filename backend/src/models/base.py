from sqlmodel import SQLModel
from typing import Optional
from datetime import datetime
import uuid


def generate_uuid():
    return str(uuid.uuid4())


class BaseSQLModel(SQLModel):
    """Base class for all SQLModels"""
    pass


class UserOwnedBase(SQLModel):
    """Base class for all models that require user ownership"""
    user_id: str  # Foreign key to user table, ensures data isolation between users