---
name: neon-sqlmodel-database
description: Expert skill for designing and configuring database models using SQLModel with Neon Serverless PostgreSQL for the multi-user Todo application. Use when creating schemas, models, relationships, database connections, and queries with user ownership enforcement.
---

# Neon PostgreSQL + SQLModel Database Skill

## Core Responsibilities
You are a specialist in building a robust, performant database layer for a multi-user Todo app using **SQLModel** (combining Pydantic + SQLAlchemy) and **Neon Serverless PostgreSQL**.

**Must strictly follow:**
- Project requirements: Tasks belong to users (foreign key to users.id managed by Better Auth)
- User isolation: Every query MUST filter by authenticated user.id
- Technology: SQLModel, asyncpg (for async), Neon PostgreSQL (serverless)
- Environment: Use `DATABASE_URL` env var for connection string (Neon provides this)
- Folder structure: Models in `/backend/models.py`, connection/session in `/backend/db.py`

## Database Schema Requirements (implement EXACTLY)

1. **users table** (managed by Better Auth – you only reference it)
   - id: str (primary key, UUID or string from auth)
   - email: str (unique)
   - Other fields: as per Better Auth

2. **tasks table**
   - id: int (primary key, auto-increment)
   - user_id: str (foreign key → users.id, not nullable)
   - title: str (not null, max_length=200)
   - description: str | None (max_length=1000)
   - completed: bool (default=False)
   - created_at: datetime (default=func.now())
   - updated_at: datetime (default=func.now(), onupdate=func.now())

3. **Indexes** (for performance)
   - Index on tasks.user_id
   - Index on tasks.completed (for filtering pending/completed)
   - Composite index on (user_id, created_at) if needed for sorting

## Connection & Session Setup
- Use async engine/session factory
- Example in `/backend/db.py`:
```python
from sqlmodel import SQLModel, create_engine, Session
from sqlmodel.ext.asyncio.session import AsyncSession, AsyncEngine
import os

DATABASE_URL = os.getenv("DATABASE_URL")  # Neon provides postgresql://... url

engine = AsyncEngine(create_engine(DATABASE_URL, echo=False, future=True))

async def get_session() -> AsyncSession:
    async with AsyncSession(engine) as session:
        yield session
```

## Model Implementation
- Use SQLModel for both table definitions and Pydantic validation
- Example Task model:
```python
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime
from sqlalchemy.sql import func

class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id")
    title: str = Field(max_length=200, nullable=False)
    description: Optional[str] = Field(max_length=1000, default=None)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default=func.now())
    updated_at: datetime = Field(default=func.now(), onupdate=func.now())

    # Relationship to user (optional, if needed)
    user: Optional["User"] = Relationship(back_populates="tasks")
```

## Query Patterns (with user isolation)
- Always filter by user_id in every query
- Example queries:
```python
# Get all tasks for a user
async def get_tasks_for_user(session: AsyncSession, user_id: str):
    result = await session.execute(
        select(Task).where(Task.user_id == user_id).order_by(Task.created_at.desc())
    )
    return result.scalars().all()

# Create task for user
async def create_task(session: AsyncSession, user_id: str, title: str, description: str | None = None):
    task = Task(user_id=user_id, title=title, description=description)
    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task

# Get single task with ownership check
async def get_task_by_id(session: AsyncSession, task_id: int, user_id: str):
    result = await session.execute(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    )
    return result.scalar_one_or_none()
```

## Best Practices
- Use async/await for all database operations
- Always commit/refresh after writes
- Use proper error handling (try/except for database operations)
- Create indexes for frequently queried columns
- Use SQLModel's relationship system for joins when needed
- Keep models and database logic separate from API routes