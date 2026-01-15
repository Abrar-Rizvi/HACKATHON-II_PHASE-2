import logging
from datetime import datetime
import sys


def setup_logging():
    """
    Set up logging configuration for the application
    """
    # Create a custom logger
    logger = logging.getLogger("todo_app")
    logger.setLevel(logging.DEBUG)

    # Create handlers
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)

    # Create formatters and add it to handlers
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    console_handler.setFormatter(formatter)

    # Add handlers to the logger
    if not logger.handlers:  # Prevent adding duplicate handlers
        logger.addHandler(console_handler)

    return logger


# Initialize logger
logger = setup_logging()