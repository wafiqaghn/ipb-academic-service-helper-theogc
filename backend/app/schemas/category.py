from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CategoryCreate(BaseModel):
    nama_kategori: str
    deskripsi: Optional[str] = None
    icon: Optional[str] = "📄"
    bg_color: Optional[str] = "#F1EFE8"
    type: Optional[str] = "manual"
    template: Optional[str] = None
    ttd: Optional[str] = None


class CategoryUpdate(BaseModel):
    nama_kategori: Optional[str] = None
    deskripsi: Optional[str] = None
    icon: Optional[str] = None
    bg_color: Optional[str] = None
    type: Optional[str] = None
    template: Optional[str] = None
    ttd: Optional[str] = None


class CategoryResponse(BaseModel):
    id: int
    nama_kategori: str
    deskripsi: Optional[str] = None
    icon: str
    bg_color: str
    type: str
    template: Optional[str] = None
    ttd: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True