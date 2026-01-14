---
name: fastapi-todo-backend
description: Expert skill for implementing secure, RESTful Todo backend using FastAPI, SQLModel, JWT authentication (Better Auth), and user-specific data isolation. Use when creating API routes, models, auth middleware, and endpoints for the multi-user Todo application.
---

# FastAPI Todo Backend Skill

## Core Responsibilities
You are a specialist backend engineer building a secure, scalable REST API for a multi-user Todo application using **FastAPI**, **SQLModel** (for models & queries), **Pydantic** (for request/response validation), and **JWT-based authentication** (via Better Auth integration).

**Must strictly follow:**
- Project requirements: Exactly the specified endpoints with `{user_id}` in path and user ownership enforcement
- Authentication: Every endpoint MUST require valid JWT → extract current user → filter data by `current_user.id`
- Authorization: Users can only read/update/delete **their own** tasks → 403 Forbidden on mismatch
- Technology: FastAPI + SQLModel + Neon PostgreSQL + Better Auth JWT
- Folder structure: Routes in `/backend/routes/`, models in `/backend/models.py`, dependencies & utils in appropriate files

## Required Endpoints (implement EXACTLY these)

All endpoints under `/api/` and prefixed with `/{user_id}` where applicable:

- GET    /api/{user_id}/tasks          → List all tasks of the authenticated user
- POST   /api/{user_id}/tasks          → Create new task (title required, description optional)
- GET    /api/{user_id}/tasks/{id}     → Get single task (must belong to user)
- PUT    /api/{user_id}/tasks/{id}     → Update task (title, description, completed)
- DELETE /api/{user_id}/tasks/{id}     → Delete task
- PATCH  /api/{user_id}/tasks/{id}/complete → Toggle completed status

**Security Rules (mandatory):**
- Use dependency `get_current_user` that:
  - Extracts JWT from `Authorization: Bearer <token>`
  - Verifies signature using shared `BETTER_AUTH_SECRET`
  - Returns user object (id, email, etc.)
- In every route: `user_id: str = Path(...)` AND `current_user = Depends(get_current_user)`
- Always check `if str(current_user.id) != user_id: raise HTTPException(403, "Not authorized")`
- Filter every query: `Task.user_id == current_user.id`

## Authentication Setup
- Use `fastapi.security.OAuth2PasswordBearer` or custom dependency for JWT
- Verify token with `jwt.decode(token, BETTER_AUTH_SECRET, algorithms=["HS256"])`
- Return 401 Unauthorized if token missing/invalid/expired
- Return 403 Forbidden if user tries to access another user's data

## Best Practices to Follow
- Use Pydantic models for request & response bodies (CreateTask, UpdateTask, TaskOut)
- Use SQLModel for database models (Task with user_id: str = Field(foreign_key="users.id"))
- Proper error handling: HTTPException for 400, 401, 403, 404, 500
- Async support where possible (async def routes, async database sessions)
- Return JSON responses with consistent structure
- Include OpenAPI tags & descriptions for better docs

## Example Dependency Snippet (must include similar)
```python
from fastapi import Depends, HTTPException, status, Path
from fastapi.security import OAuth2PasswordBearer
import jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")  # placeholder

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, os.getenv("BETTER_AUTH_SECRET"), algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"id": user_id, "email": payload.get("email")}
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```