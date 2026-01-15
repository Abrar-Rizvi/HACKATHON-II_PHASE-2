# Quickstart Guide: Core Backend API & Database Foundation

## Prerequisites

- Python 3.10 or higher
- PostgreSQL client libraries
- UV package manager (optional but recommended)

## Setup Instructions

### 1. Clone and Navigate to Project
```bash
git clone <repository-url>
cd <project-root>
cd backend
```

### 2. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install UV (if not already installed)
```bash
pip install uv
```

### 4. Install Dependencies with UV
```bash
uv pip install -r requirements.txt
# Or if using pyproject.toml:
uv sync
```

### 5. Set Up Environment Variables
Create a `.env` file in the backend directory:
```env
DATABASE_URL=postgresql+psycopg2://username:password@localhost:5432/todo_db
UVICORN_HOST=127.0.0.1
UVICORN_PORT=8000
UVICORN_RELOAD=true
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 6. Initialize Database
```bash
# Run database migrations
python -m alembic upgrade head
# Or create tables directly if not using migrations
python -c "from backend.src.database.connection import engine; from backend.src.models.task_model import Task; Task.metadata.create_all(bind=engine)"
```

### 7. Run the Application
```bash
# Using uvicorn directly
uvicorn backend.src.main:app --reload --host 127.0.0.1 --port 8000

# Or using the run script if available
python -m backend.src.main
```

## API Endpoints

Once running, visit `http://127.0.0.1:8000/docs` for interactive API documentation.

### Available Endpoints:
- `GET /api/{user_id}/tasks` - List all tasks for a user
- `POST /api/{user_id}/tasks` - Create a new task
- `GET /api/{user_id}/tasks/{id}` - Get a specific task
- `PUT /api/{user_id}/tasks/{id}` - Update a task
- `DELETE /api/{user_id}/tasks/{id}` - Delete a task

## Testing the API

### Example: Create a Task
```bash
curl -X POST "http://127.0.0.1:8000/api/123e4567-e89b-12d3-a456-426614174000/tasks" \
  -H "Content-Type: application/json" \
  -d '{"title": "Sample Task", "description": "This is a sample task"}'
```

### Example: List Tasks for a User
```bash
curl -X GET "http://127.0.0.1:8000/api/123e4567-e89b-12d3-a456-426614174000/tasks"
```

## Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=backend

# Run specific test file
pytest tests/unit/test_task_model.py
```