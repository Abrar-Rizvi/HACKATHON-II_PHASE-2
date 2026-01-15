from sqlmodel import SQLModel
from typing import Optional
from datetime import datetime
import uuid


def generate_uuid():
    return str(uuid.uuid4())


class BaseSQLModel(SQLModel):
    """Base class for all SQLModels"""
    pass