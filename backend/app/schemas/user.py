from pydantic import BaseModel, EmailStr
from app.models.enums import UserRole
from datetime import datetime
from typing import Optional


class UserCreate(BaseModel):
    email: EmailStr
    nama: str
    nim_or_nip: Optional[str] = None
    password: str
    role: UserRole = UserRole.mahasiswa


class UserUpdate(BaseModel):
    nama: Optional[str] = None
    email: Optional[EmailStr] = None
    nim_or_nip: Optional[str] = None
    role: Optional[UserRole] = None


class UserResponse(BaseModel):
    id: int
    email: str
    nama: str
    nim_or_nip: Optional[str] = None
    role: UserRole
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserBrief(BaseModel):
    id: int
    email: str
    nama: str
    nim_or_nip: Optional[str] = None
    role: UserRole

    class Config:
        from_attributes = True