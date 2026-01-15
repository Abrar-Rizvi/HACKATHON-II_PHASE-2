import uuid
from typing import Union


def generate_uuid() -> str:
    """
    Generate a new UUID string

    Returns:
        str: A new UUID as a string
    """
    return str(uuid.uuid4())


def is_valid_uuid(uuid_string: str) -> bool:
    """
    Check if the provided string is a valid UUID

    Args:
        uuid_string (str): String to validate

    Returns:
        bool: True if valid UUID, False otherwise
    """
    try:
        uuid.UUID(uuid_string)
        return True
    except ValueError:
        return False