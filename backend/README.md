# Todo Backend API

A FastAPI-based backend service for the Todo application with PostgreSQL persistence using SQLModel ORM.

## Features

- RESTful API with full CRUD operations for tasks
- User isolation - each user can only access their own tasks
- PostgreSQL database with SQLModel ORM
- Automatic OpenAPI documentation
- Comprehensive error handling

## Tech Stack

- Python 3.10+
- FastAPI
- SQLModel
- PostgreSQL (via Neon Serverless)
- Uvicorn ASGI server

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables (copy .env.example to .env and update values)

4. Run the application:
   ```bash
   uvicorn src.main:app --reload
   ```

## API Documentation

API documentation is automatically available at `/docs` when the server is running.

## Endpoints

- `GET /api/{user_id}/tasks` - Get all tasks for a user
- `POST /api/{user_id}/tasks` - Create a new task
- `GET /api/{user_id}/tasks/{id}` - Get a specific task
- `PUT /api/{user_id}/tasks/{id}` - Update a task
- `DELETE /api/{user_id}/tasks/{id}` - Delete a task