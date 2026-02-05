from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import Optional
from pydantic import BaseModel
from datetime import datetime, timedelta
import jwt
from ..models.user_model import User, UserCreate
from ..database.session import get_session
from sqlmodel import Session, select
from werkzeug.security import check_password_hash, generate_password_hash
import os
from uuid import UUID

router = APIRouter(prefix="/auth", tags=["authentication"])

# JWT Configuration - Using the same secret as the middleware
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET", "your-default-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user_id: str  # Changed to string to accommodate UUID
    expires_at: datetime

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/login", response_model=LoginResponse)
def login(login_request: LoginRequest, session: Session = Depends(get_session)):
    """
    Authenticate user and return JWT token
    """
    # Query for user by email
    statement = select(User).where(User.email == login_request.email)
    user = session.exec(statement).first()

    if not user or not check_password_hash(user.hashed_password, login_request.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=access_token_expires
    )

    expires_at = datetime.utcnow() + access_token_expires

    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user_id=str(user.id),  # Convert to string for UUID compatibility
        expires_at=expires_at
    )

@router.post("/token", response_model=Token)  # OAuth2 compatible endpoint
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    """
    OAuth2 compatible token endpoint for login
    """
    statement = select(User).where(User.email == form_data.username)
    user = session.exec(statement).first()

    if not user or not check_password_hash(user.hashed_password, form_data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=access_token_expires
    )

    return Token(access_token=access_token, token_type="bearer")

@router.post("/register", response_model=LoginResponse)
def register(user_create: UserCreate, session: Session = Depends(get_session)):
    """
    Register a new user and return JWT token
    """
    # Check if user already exists
    existing_user = session.exec(select(User).where(User.email == user_create.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    # Hash the password
    hashed_password = generate_password_hash(user_create.password)

    # Create new user
    db_user = User(
        email=user_create.email,
        username=user_create.username,
        hashed_password=hashed_password
    )

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(db_user.id), "email": db_user.email},
        expires_delta=access_token_expires
    )

    expires_at = datetime.utcnow() + access_token_expires

    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user_id=str(db_user.id),  # Convert to string for UUID compatibility
        expires_at=expires_at
    )