from pydantic import BaseModel, EmailStr
from app.models.enums import UserRole

class RegisterRequest(BaseModel):
    email: EmailStr
    nama: str
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    id: int
    nama: str
    email: str
    nim_or_nip: str | None = None
    role: str

class UserResponse(BaseModel):
    id: int
    email: str
    nama: str
    nim_or_nip: str | None = None
    role: UserRole

    class Config:
        from_attributes = True
