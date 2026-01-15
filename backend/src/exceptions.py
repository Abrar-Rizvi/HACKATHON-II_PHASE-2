class TaskNotFoundException(Exception):
    """Raised when a task is not found"""
    def __init__(self, task_id: str, user_id: str):
        self.task_id = task_id
        self.user_id = user_id
        super().__init__(f"Task with id {task_id} not found for user {user_id}")


class UserNotFoundException(Exception):
    """Raised when a user is not found"""
    def __init__(self, user_id: str):
        self.user_id = user_id
        super().__init__(f"User with id {user_id} not found")


class UnauthorizedAccessException(Exception):
    """Raised when a user tries to access a resource they don't own"""
    def __init__(self, resource_type: str, resource_id: str, user_id: str):
        self.resource_type = resource_type
        self.resource_id = resource_id
        self.user_id = user_id
        super().__init__(f"User {user_id} does not have access to {resource_type} {resource_id}")


class ValidationError(Exception):
    """Raised when input validation fails"""
    def __init__(self, message: str):
        self.message = message
        super().__init__(message)


class DatabaseConnectionException(Exception):
    """Raised when there is an issue connecting to the database"""
    def __init__(self, message: str = "Database connection failed"):
        self.message = message
        super().__init__(message)


class DuplicateResourceException(Exception):
    """Raised when trying to create a resource that already exists"""
    def __init__(self, resource_type: str, identifier: str):
        self.resource_type = resource_type
        self.identifier = identifier
        super().__init__(f"{resource_type} with identifier {identifier} already exists")