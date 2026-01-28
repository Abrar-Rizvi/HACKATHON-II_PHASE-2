#!/usr/bin/env python3
"""
Script to initialize the database tables
"""

from src.database.connection import engine
from src.models.user_model import User
from src.models.task_model import Task
from sqlmodel import SQLModel

def create_tables():
    """Create all database tables"""
    print("Creating database tables...")
    SQLModel.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    create_tables()