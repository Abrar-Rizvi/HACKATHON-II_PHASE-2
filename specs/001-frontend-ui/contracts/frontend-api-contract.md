# Frontend-Backend API Contract

## Overview
API contract defining how the frontend UI will interact with the backend API for the Todo application.

## Authentication Endpoints

### POST /api/auth/register
Register a new user

**Request**:
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response (200)**:
```json
{
  "access_token": "string",
  "token_type": "bearer",
  "user_id": "number",
  "expires_at": "timestamp"
}
```

**Response (409)**:
```json
{
  "detail": "Email already registered"
}
```

### POST /api/auth/login
Login an existing user

**Request**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200)**:
```json
{
  "access_token": "string",
  "token_type": "bearer",
  "user_id": "number",
  "expires_at": "timestamp"
}
```

**Response (401)**:
```json
{
  "detail": "Incorrect email or password"
}
```

## Todo Endpoints

### GET /api/todos
Get todos for authenticated user

**Headers**:
```
Authorization: Bearer {token}
```

**Response (200)**:
```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "completed": "boolean",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
]
```

### POST /api/todos
Create a new todo

**Headers**:
```
Authorization: Bearer {token}
```

**Request**:
```json
{
  "title": "string",
  "description": "string"
}
```

**Response (201)**:
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "completed": "boolean",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### PUT /api/todos/{id}
Update a todo

**Headers**:
```
Authorization: Bearer {token}
```

**Request**:
```json
{
  "title": "string",
  "description": "string",
  "completed": "boolean"
}
```

**Response (200)**:
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "completed": "boolean",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### DELETE /api/todos/{id}
Delete a todo

**Headers**:
```
Authorization: Bearer {token}
```

**Response (204)**:
```
No content
```

## Error Response Format

All error responses follow this format:

**Response (4xx/5xx)**:
```json
{
  "detail": "error message"
}
```

## Frontend Implementation Requirements

### Authentication Flow
1. Store JWT token in httpOnly cookie after login/register
2. Include JWT token in Authorization header for protected requests
3. Handle token expiration gracefully
4. Redirect to login on authentication failures

### Form Validation
1. Client-side validation with real-time feedback
2. Server-side validation with appropriate error messages
3. Error message display for form fields

### Loading States
1. Show loading indicators during API requests
2. Disable form submissions during requests
3. Provide feedback for successful operations