from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .routes import tasks
from .exceptions import (
    TaskNotFoundException,
    UserNotFoundException,
    UnauthorizedAccessException,
    ValidationError,
    DatabaseConnectionException,
    DuplicateResourceException
)
import logging
from .utils.logging import logger

# Create FastAPI app instance
app = FastAPI(
    title="Todo API",
    description="RESTful API for managing todo tasks with user isolation",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(tasks.router, prefix="/api/{user_id}")

# Add request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"{request.method} {request.url}")
    response = await call_next(request)
    return response

# Global exception handlers
@app.exception_handler(TaskNotFoundException)
async def handle_task_not_found(request: Request, exc: TaskNotFoundException):
    return JSONResponse(
        status_code=404,
        content={"detail": str(exc)}
    )

@app.exception_handler(UserNotFoundException)
async def handle_user_not_found(request: Request, exc: UserNotFoundException):
    return JSONResponse(
        status_code=404,
        content={"detail": str(exc)}
    )

@app.exception_handler(UnauthorizedAccessException)
async def handle_unauthorized_access(request: Request, exc: UnauthorizedAccessException):
    return JSONResponse(
        status_code=403,
        content={"detail": str(exc)}
    )

@app.exception_handler(ValidationError)
async def handle_validation_error(request: Request, exc: ValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.message}
    )

@app.exception_handler(DatabaseConnectionException)
async def handle_database_connection_error(request: Request, exc: DatabaseConnectionException):
    return JSONResponse(
        status_code=500,
        content={"detail": exc.message}
    )

@app.exception_handler(DuplicateResourceException)
async def handle_duplicate_resource(request: Request, exc: DuplicateResourceException):
    return JSONResponse(
        status_code=409,
        content={"detail": str(exc)}
    )

@app.exception_handler(Exception)
async def handle_general_exception(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred"}
    )

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "todo-backend"}

# Root endpoint
@app.get("/")
def root():
    return {"message": "Welcome to the Todo API", "docs": "/docs"}