from pydantic import BaseModel, EmailStr
from app.models.enums import UserRole

class RegisterRequest(BaseModel):
    email: str
    name: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    id: int
    nama: str
    email: str
    role: str

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    role: UserRole

    class Config:
        from_attributes = True