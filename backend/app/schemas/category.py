from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = "📄"
    bg_color: Optional[str] = "#F1EFE8"
    type: Optional[str] = "manual"
    template: Optional[str] = None
    ttd: Optional[str] = None


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    bg_color: Optional[str] = None
    type: Optional[str] = None
    template: Optional[str] = None
    ttd: Optional[str] = None


class CategoryResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    icon: str
    bg_color: str
    type: str
    template: Optional[str] = None
    ttd: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
