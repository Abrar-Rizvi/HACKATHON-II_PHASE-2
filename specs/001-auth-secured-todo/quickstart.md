# Quickstart Guide: Complete Auth-Secured Full-Stack Todo Application

## Overview
This guide provides a quick overview of how to set up and run the JWT-secured full-stack Todo application based on the feature specification in `/specs/001-auth-secured-todo/spec.md`.

## Prerequisites
- Node.js 18+ for frontend
- Python 3.10+ for backend
- PostgreSQL-compatible database (Neon Serverless PostgreSQL)
- Better Auth compatible environment

## Setup Steps

### 1. Environment Configuration
1. Copy `.env.example` to `.env` in both frontend and backend directories
2. Set `BETTER_AUTH_SECRET` to the same value in both frontend and backend
3. Configure `DATABASE_URL` for Neon PostgreSQL connection in backend
4. Set frontend API base URL to point to backend

### 2. Backend Setup
1. Navigate to the `backend` directory
2. Install dependencies: `pip install -r requirements.txt`
3. Set up database connection to Neon PostgreSQL
4. Run database migrations if applicable
5. Start the backend server: `uvicorn src.main:app --reload`

### 3. Frontend Setup
1. Navigate to the `frontend` directory
2. Install dependencies: `npm install`
3. Configure API endpoints to match backend URLs
4. Start the development server: `npm run dev`

### 4. Authentication Setup
1. Configure Better Auth with JWT plugin
2. Ensure shared secret matches between frontend and backend
3. Test authentication flow: register → login → receive JWT → API access

## Key Features

### Task Management
- Create tasks with title and description
- View all tasks belonging to authenticated user
- Update task details and completion status
- Delete tasks
- Toggle task completion with PATCH request

### Security Features
- JWT-based authentication for all protected endpoints
- User isolation - each user sees only their own tasks
- Task ownership enforcement on all operations
- Standardized error responses

## API Endpoints
- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/{id}` - Get specific task
- `PUT /api/tasks/{id}` - Update task
- `PATCH /api/tasks/{id}` - Toggle completion status
- `DELETE /api/tasks/{id}` - Delete task

## Development Workflow

### Frontend Development
1. Implement API client in `/lib/api.ts`
2. Add JWT token attachment to all requests
3. Build task management UI components
4. Connect UI to API using the centralized client

### Backend Development
1. Implement JWT verification middleware
2. Create SQLModel schemas for users and tasks
3. Build protected API routes with user ownership validation
4. Add error handling with standardized response format

## Testing the Application

### Authentication Flow
1. Register a new user
2. Log in and receive JWT token
3. Verify token is stored securely
4. Confirm token is attached to API requests

### Task Operations
1. Create a new task
2. Verify task appears in user's task list
3. Update task details and completion status
4. Delete the task
5. Confirm other users cannot access this task

## Troubleshooting

### Common Issues
- JWT token not being sent with requests → Check API client implementation
- Users seeing other users' tasks → Verify user_id filtering in queries
- Authentication failing → Confirm BETTER_AUTH_SECRET consistency
- Database connection errors → Verify Neon PostgreSQL configuration

### Security Checks
- Verify all endpoints require JWT authentication
- Confirm user isolation is enforced
- Check that error messages don't leak sensitive data
- Validate that user_id comes from JWT, not URL parameters