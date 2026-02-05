# Data Model: Complete Auth-Secured Full-Stack Todo Application

## Overview
This document defines the data model for the JWT-secured full-stack Todo application based on the feature specification in `/specs/001-auth-secured-todo/spec.md`.

## Core Entities

### User Entity
Represents an authenticated user of the system, uniquely identified by their ID and authenticated via JWT

**Fields:**
- `id`: UUID (primary key) - Unique identifier for the user
- `email`: String (unique) - User's email address for login
- `password_hash`: String - Hashed password (handled by Better Auth)
- `created_at`: Timestamp - Account creation time
- `updated_at`: Timestamp - Last account update time

**Relationships:**
- One-to-many with Task (one user can have many tasks)

**Validation Rules:**
- Email must be valid email format
- Email must be unique across all users
- Password must meet security requirements (handled by Better Auth)

### Task Entity
Represents a todo item owned by a specific user, containing id, title, description, completion status, creation timestamp, and user_id

**Fields:**
- `id`: UUID (primary key) - Unique identifier for the task
- `user_id`: UUID (foreign key) - Reference to the owning user
- `title`: String - Task title/description (required)
- `description`: Text (optional) - Detailed description of the task
- `completed`: Boolean - Completion status (default: false)
- `created_at`: Timestamp - Task creation time
- `updated_at`: Timestamp - Last task update time

**Relationships:**
- Many-to-one with User (many tasks belong to one user)

**Validation Rules:**
- Title must not be empty
- User_id must reference an existing user
- Completed status must be boolean

### JWT Token Entity (Conceptual)
Represents an authenticated session containing user identity information for authorization

**Fields:**
- `token`: String - The JWT token string
- `user_id`: UUID - The user ID embedded in the token
- `expires_at`: Timestamp - Token expiration time
- `issued_at`: Timestamp - Token creation time

**Validation Rules:**
- Token must be properly formatted JWT
- Token must not be expired
- User_id must reference an existing user

## Database Schema

### SQL Tables

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_users_email ON users(email);
```

## State Transitions

### Task States
- **Pending**: `completed = false` - Task exists but not yet completed
- **Completed**: `completed = true` - Task has been marked as completed

### State Transition Rules
1. A task can transition from `pending` to `completed` via PATCH request
2. A task can transition from `completed` to `pending` via PATCH request
3. Task creation always starts in `pending` state (completed = false)
4. Task deletion removes the record entirely

## Relationships

### User-Task Relationship
- **Type**: One-to-Many (One user owns many tasks)
- **Constraint**: Foreign key from tasks.user_id to users.id
- **Cascade**: When a user is deleted, all their tasks are also deleted
- **Access Control**: Users can only access tasks where user_id matches their own

## API Data Contracts

### Task Request/Response Models

**Create Task Request:**
```json
{
  "title": "String (required)",
  "description": "String (optional)"
}
```

**Task Response:**
```json
{
  "id": "UUID",
  "user_id": "UUID",
  "title": "String",
  "description": "String or null",
  "completed": "Boolean",
  "created_at": "ISO 8601 timestamp",
  "updated_at": "ISO 8601 timestamp"
}
```

**Update Task Request:**
```json
{
  "title": "String (optional)",
  "description": "String (optional)",
  "completed": "Boolean (optional)"
}
```

### Error Response Model
```json
{
  "error": "String - Error type identifier",
  "message": "String - Human-readable error message",
  "status_code": "Integer - HTTP status code"
}
```

## Validation Rules Summary

### Business Logic Validation
1. Users can only create tasks for themselves (user context from JWT)
2. Users can only read/update/delete their own tasks
3. Task titles must not be empty
4. Task user_id must match the authenticated user from JWT

### Data Integrity Validation
1. All required fields must be present
2. Foreign key constraints must be satisfied
3. Data types must match defined schema
4. Unique constraints must be respected

## Security Considerations

### Data Access Control
- All queries must filter by `user_id` to prevent unauthorized access
- User context must come from JWT token, not URL or request body
- Authentication required for all task-related operations

### Privacy Protection
- Users cannot see other users' tasks
- User IDs are not exposed in API responses unnecessarily
- Sensitive data is not logged or stored inappropriately