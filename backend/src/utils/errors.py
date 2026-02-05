from fastapi import HTTPException, status
from pydantic import BaseModel
from typing import Optional


class ErrorResponse(BaseModel):
    """
    Standardized error response model
    """
    error: str
    message: str
    status_code: int


def create_error_response(error_type: str, message: str, status_code: int) -> dict:
    """
    Create a standardized error response

    Args:
        error_type: Type of error (e.g., "unauthorized", "forbidden", "not_found")
        message: Human-readable error message
        status_code: HTTP status code

    Returns:
        Dictionary with standardized error format
    """
    return {
        "error": error_type,
        "message": message,
        "status_code": status_code
    }


def unauthorized_error(detail: str = "Authentication token is missing or invalid") -> HTTPException:
    """
    Create a standardized 401 Unauthorized exception

    Args:
        detail: Error message

    Returns:
        HTTPException with 401 status code
    """
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=create_error_response("unauthorized", detail, status.HTTP_401_UNAUTHORIZED)
    )


def forbidden_error(detail: str = "Access denied - insufficient permissions") -> HTTPException:
    """
    Create a standardized 403 Forbidden exception

    Args:
        detail: Error message

    Returns:
        HTTPException with 403 status code
    """
    return HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail=create_error_response("forbidden", detail, status.HTTP_403_FORBIDDEN)
    )


def not_found_error(detail: str = "Requested resource does not exist") -> HTTPException:
    """
    Create a standardized 404 Not Found exception

    Args:
        detail: Error message

    Returns:
        HTTPException with 404 status code
    """
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=create_error_response("not_found", detail, status.HTTP_404_NOT_FOUND)
    )


def validation_error(detail: str = "Request data validation failed") -> HTTPException:
    """
    Create a standardized 422 Validation Error exception

    Args:
        detail: Error message

    Returns:
        HTTPException with 422 status code
    """
    return HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail=create_error_response("validation_error", detail, status.HTTP_422_UNPROCESSABLE_ENTITY)
    )