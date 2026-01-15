# Data Model: Core Backend API & Database Foundation

## Task Entity

### Fields
- **id**: UUID (Primary Key) - Unique identifier for each task
- **user_id**: UUID (Foreign Key) - Links task to the owning user
- **title**: String (max 100 characters) - Task title/description (required)
- **description**: String (max 500 characters, optional) - Detailed task description
- **completed**: Boolean - Task completion status (default: False)
- **created_at**: DateTime - Timestamp when task was created
- **updated_at**: DateTime - Timestamp when task was last updated

### Relationships
- **User**: Many-to-One relationship (many tasks belong to one user)
- **Ownership**: Each task is owned by exactly one user via user_id foreign key

### Constraints
- **Required fields**: id, user_id, title, completed, created_at, updated_at
- **Validation**:
  - Title: 1-100 characters
  - Description: 0-500 characters (optional)
  - user_id must reference an existing user
- **Indexing**: Index on user_id for efficient user-based queries
- **Timestamps**: Automatically managed by the database/system

### State Transitions
- **Creation**: New task with completed=False, timestamps set
- **Update**: Title/description/completed can change, updated_at refreshes
- **Deletion**: Hard delete removes task permanently

## User Entity

### Fields
- **id**: UUID (Primary Key) - Unique identifier for each user
- **email**: String (unique) - User's email address
- **password_hash**: String - Hashed password for authentication
- **created_at**: DateTime - Timestamp when user was created

### Relationships
- **Tasks**: One-to-Many relationship (one user has many tasks)

### Constraints
- **Required fields**: id, email, password_hash, created_at
- **Validation**: Email format validation, unique email constraint
- **Indexing**: Unique index on email for efficient lookup

## Database Schema

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
```

## API Data Transfer Objects

### TaskCreate Schema
- **title**: Required string (1-100 chars)
- **description**: Optional string (0-500 chars)
- **completed**: Optional boolean (default: False)

### TaskUpdate Schema
- **title**: Optional string (1-100 chars)
- **description**: Optional string (0-500 chars)
- **completed**: Optional boolean

### TaskResponse Schema
- All Task entity fields plus validation for API responses