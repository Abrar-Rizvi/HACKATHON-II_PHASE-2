# Data Model: User-Level Authorization for Todo API

## Overview
This document defines the data structures and authorization models related to user-level data isolation and task ownership enforcement for the Todo API, based on the feature specification requirements.

## Core Entities

### 1. Authenticated User Context
**Description**: Runtime context object containing validated user identity for authorization checks
**Fields**:
- `user_id` (string): Unique identifier for the authenticated user (UUID format)
- `email` (string): Email address associated with the authenticated user
- `expires_at` (datetime): Timestamp when the token expires
- `issued_at` (datetime): Timestamp when the token was issued

**Validation Rules**:
- user_id must be present and non-empty
- user_id must match the format expected by the system (UUID)
- Token must be valid and not expired

### 2. Task with Ownership
**Description**: Todo task entity with user ownership information
**Fields**:
- `id` (string): Unique identifier for the task (UUID format)
- `user_id` (string): Foreign key to the user who owns this task
- `title` (string): Task description/title
- `completed` (boolean): Whether the task is completed
- `created_at` (datetime): When the task was created
- `updated_at` (datetime): When the task was last updated

**Validation Rules**:
- user_id must match the authenticated user's user_id for access
- All modifications must respect the user_id ownership constraint

### 3. User's Task Collection
**Description**: Logical grouping of tasks belonging to a specific user
**Relationships**:
- One user to many tasks (via user_id foreign key)
- Tasks can only be accessed by their owner

## Authorization Models

### 1. Authorization Check Result
**Description**: Container for the outcome of authorization validation
**Fields**:
- `authorized` (bool): Whether the user is authorized to perform the action
- `resource_owner_id` (string): The ID of the resource owner (for comparison)
- `authenticated_user_id` (string): The ID of the authenticated user
- `error_message` (string): Description of authorization failure (if applicable)

**Validation Rules**:
- When authorized is True, resource_owner_id and authenticated_user_id must match
- When authorized is False, error_message must be populated

### 2. Task Ownership Validation (Pydantic Model)
Used in service layer to validate ownership:

```python
class TaskOwnershipValidation(BaseModel):
    user_id_from_token: str
    user_id_from_url: str
    task_owner_id: str
    is_valid: bool
    error_code: Optional[str] = None
```

## State Transitions

### Authorization Flow
```
Incoming Request with JWT Token
    ↓
Extract authenticated user_id from JWT
    ↓
Validate URL user_id matches JWT user_id
    ↓
Query database filtering by user_id
    ↓
Attempt to retrieve task
    ↓
If task exists and user_id matches → Authorized
    ↓
If no task found with this user_id → Return 404
```

## API Contract Models

### 1. AuthorizationError (Pydantic Model)
Used for standardized error responses:

```python
class AuthorizationError(BaseModel):
    error: str
    error_code: str
    timestamp: datetime
```

## Relationships
- Authenticated User Context → Task (one-to-many via user_id)
- Task → User's Task Collection (membership in collection)
- Authorization Check Result → API Responses (for error cases)

## Constraints
- All data access must be validated against authenticated user_id
- No cross-user data access allowed
- Database queries must filter by user_id
- Error responses must not leak information about resource existence
- Authorization checks must occur before data retrieval