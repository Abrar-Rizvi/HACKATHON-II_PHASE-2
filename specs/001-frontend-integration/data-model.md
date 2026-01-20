# Data Model: Frontend Integration & Responsive UI for Full-Stack Todo App

## Task Entity

**Fields:**
- `id`: string | UUID - Unique identifier for the task
- `title`: string - Title of the task (required)
- `description`: string | null - Optional description of the task
- `completed`: boolean - Whether the task is completed (default: false)
- `dueDate`: Date | string | null - Due date for the task (optional)
- `createdAt`: Date | string - Timestamp when task was created
- `updatedAt`: Date | string - Timestamp when task was last updated
- `userId`: string | UUID - Owner of the task (extracted from JWT)

**Validation Rules:**
- Title must be 1-200 characters
- Description, if provided, must be 0-1000 characters
- Due date, if provided, must be a valid future date
- Completed status must be boolean
- userId must match authenticated user's ID from JWT

**State Transitions:**
- Pending → Completed (when user toggles completion)
- Completed → Pending (when user toggles completion)
- Created → Pending (when new task is created)
- Any state → Deleted (when user deletes task)

## User Session Entity

**Fields:**
- `user`: object - User information from Better Auth
  - `id`: string | UUID - User's unique identifier
  - `email`: string - User's email address
  - `name`: string | null - User's name (optional)
- `jwtToken`: string - JWT token from Better Auth
- `expiresAt`: Date | string - Token expiration time
- `isLoggedIn`: boolean - Current authentication status

**Validation Rules:**
- JWT token must be valid and not expired
- User ID must match token claims
- Session must be refreshed before expiration

## API Response Entity

**Fields:**
- `success`: boolean - Whether the request was successful
- `data`: any - Response data (varies by endpoint)
- `error`: object | null - Error information if request failed
  - `message`: string - Human-readable error message
  - `code`: string - Machine-readable error code
  - `details`: object | null - Additional error details

**Validation Rules:**
- Success and error properties are mutually exclusive
- If success is true, data must be present
- If success is false, error must be present with message

## UI State Entity

**Fields:**
- `loading`: boolean - Whether an operation is in progress
- `error`: string | null - Error message to display to user
- `success`: string | null - Success message to display to user
- `tasks`: Task[] - Current list of tasks
- `currentView`: string - Current UI view ('list', 'form', 'detail')

**Validation Rules:**
- Loading and error states should not be active simultaneously
- Current view must be one of allowed values
- Tasks array must contain valid Task entities