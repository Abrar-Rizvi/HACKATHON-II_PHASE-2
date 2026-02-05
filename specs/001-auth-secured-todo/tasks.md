# Tasks: Complete Auth-Secured Full-Stack Todo Application

**Feature**: Complete Auth-Secured Full-Stack Todo Application
**Branch**: 001-auth-secured-todo
**Date**: 2026-02-03
**Spec**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)

## Implementation Strategy

Build the JWT-secured full-stack Todo application in priority order of user stories. Start with foundational components, then implement the highest priority user story (secure task management), followed by authentication flow, and finally data isolation validation. Each user story is designed to be independently testable.

**MVP Scope**: User Story 1 (Secure Task Management) with basic JWT authentication and task CRUD operations.

## Dependencies

User Story 1 (Secure Task Management) → User Story 2 (JWT-Based Authentication Flow) → User Story 3 (Cross-Application Data Isolation)

## Parallel Execution Examples

- **User Story 1**: Database models [P], Backend API routes [P], Frontend components [P], API client [P]
- **User Story 2**: Auth middleware [P], JWT verification [P], Frontend auth integration [P]
- **User Story 3**: Security validation [P], User isolation tests [P]

---

## Phase 1: Setup

- [x] T001 Create backend directory structure with src/models, src/routes, src/middleware, src/db
- [x] T002 Create frontend directory structure with src/app, src/components, src/lib, src/types, src/hooks
- [x] T003 Initialize backend requirements.txt with FastAPI, SQLModel, psycopg2-binary, uvicorn, python-multipart
- [x] T004 Initialize frontend package.json with Next.js 16+, TypeScript, Tailwind CSS, Better Auth
- [x] T005 Set up environment configuration for BETTER_AUTH_SECRET and DATABASE_URL

## Phase 2: Foundational Components

- [x] T006 [P] Create database connection module in backend/src/db/database.py
- [x] T007 [P] Create User and Task SQLModel schemas in backend/src/models/todo_model.py
- [x] T008 [P] Create TypeScript interfaces for User, Task, and Error in frontend/src/types/index.ts
- [x] T009 [P] Create centralized API client in frontend/src/lib/api.ts with JWT attachment
- [x] T010 [P] Set up Better Auth configuration with JWT plugin in both frontend and backend

## Phase 3: User Story 1 - Secure Task Management (Priority: P1)

**Goal**: Enable registered users to securely create, view, update, and delete their personal tasks with seamless authentication.

**Independent Test**: Can be fully tested by logging in as a user, creating tasks, viewing only their own tasks, updating them, and deleting them, delivering the fundamental value of a personal todo list.

**Tasks**:

- [x] T011 [P] [US1] Implement GET /api/tasks endpoint in backend/src/routes/todo_routes.py with user_id filtering
- [x] T012 [P] [US1] Implement POST /api/tasks endpoint in backend/src/routes/todo_routes.py with JWT validation
- [x] T013 [P] [US1] Implement GET /api/tasks/{task_id} endpoint in backend/src/routes/todo_routes.py with ownership check
- [x] T014 [P] [US1] Implement PUT /api/tasks/{task_id} endpoint in backend/src/routes/todo_routes.py with ownership validation
- [x] T015 [P] [US1] Implement PATCH /api/tasks/{task_id} endpoint in backend/src/routes/todo_routes.py for completion toggle
- [x] T016 [P] [US1] Implement DELETE /api/tasks/{task_id} endpoint in backend/src/routes/todo_routes.py with ownership check
- [x] T017 [P] [US1] Create TodoList component in frontend/src/components/todo/TodoList.tsx to display user tasks
- [x] T018 [P] [US1] Create TodoItem component in frontend/src/components/todo/TodoItem.tsx for individual task display
- [x] T019 [P] [US1] Create TodoForm component in frontend/src/components/todo/TodoForm.tsx for task creation/update
- [x] T020 [US1] Integrate dashboard page with API client to fetch and display user's tasks in frontend/src/app/dashboard/page.tsx
- [x] T021 [US1] Add task CRUD functionality to dashboard UI using the centralized API client
- [x] T022 [US1] Implement task completion toggle in frontend with PATCH request to backend

## Phase 4: User Story 2 - JWT-Based Authentication Flow (Priority: P1)

**Goal**: Enable users to register or log in to the application using their credentials and receive a JWT token that authenticates them for all subsequent API requests without needing to re-authenticate.

**Independent Test**: Can be fully tested by registering/logging in and verifying that subsequent API calls are properly authenticated using the JWT token.

**Tasks**:

- [x] T023 [P] [US2] Implement JWT verification middleware in backend/src/middleware/jwt_middleware.py
- [x] T024 [P] [US2] Create utility function to extract user_id from JWT token in backend/src/utils/auth.py
- [x] T025 [P] [US2] Implement auth routes for login/register in backend/src/routes/auth_routes.py
- [x] T026 [P] [US2] Update all task endpoints to use JWT middleware for authentication
- [x] T027 [P] [US2] Create auth context and provider in frontend/src/components/auth/AuthProvider.tsx
- [x] T028 [P] [US2] Create login form component in frontend/src/components/auth/LoginForm.tsx
- [x] T029 [P] [US2] Create protected route wrapper in frontend/src/components/auth/ProtectedRoute.tsx
- [x] T030 [US2] Integrate JWT token storage and retrieval in frontend/src/lib/auth/auth-context.tsx
- [x] T031 [US2] Connect login page to auth API and token management in frontend/src/app/(auth)/login/page.tsx
- [x] T032 [US2] Ensure all API requests include Authorization header with JWT token

## Phase 5: User Story 3 - Cross-Application Data Isolation (Priority: P2)

**Goal**: Ensure users cannot access, modify, or view tasks belonging to other users, guaranteeing complete data privacy and security between users.

**Independent Test**: Can be fully tested by attempting to access other users' data and verifying that unauthorized access is prevented.

**Tasks**:

- [x] T033 [P] [US3] Enhance JWT middleware to validate user ownership of accessed resources
- [x] T034 [P] [US3] Add comprehensive user_id filtering to all database queries in backend
- [x] T035 [P] [US3] Implement 403 Forbidden responses for unauthorized access attempts
- [x] T036 [P] [US3] Create comprehensive error handling for auth failures in backend/src/utils/errors.py
- [x] T037 [P] [US3] Add frontend error handling for 401/403 responses with user feedback
- [x] T038 [US3] Test cross-user data isolation by attempting to access other users' tasks
- [x] T039 [US3] Validate that users only see their own tasks in all UI contexts
- [x] T040 [US3] Implement proper error boundaries for authentication failures in frontend

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T041 Add input validation to all API endpoints with Pydantic models
- [x] T042 Implement standardized error responses with consistent JSON format
- [x] T043 Add database indexes for performance optimization
- [x] T044 Add comprehensive logging for authentication and task operations
- [x] T045 Create health check endpoint for monitoring
- [x] T046 Add environment-specific configurations for dev/staging/prod
- [x] T047 Document API endpoints with OpenAPI/Swagger
- [x] T048 Final integration testing of complete auth-secured todo flow
- [x] T049 Update CLAUDE.md with new implementation details and technology stack