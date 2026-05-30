from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime, date
from app.models.enums import TicketStatus, TicketPriority


class TicketCreate(BaseModel):
    title: str
    description: str
    category_id: Optional[int] = None
    priority: Optional[TicketPriority] = TicketPriority.medium
    deadline: Optional[date] = None
    form_data: Optional[Dict[str, Any]] = None


class TicketUpdate(BaseModel):
    status: Optional[TicketStatus] = None
    priority: Optional[TicketPriority] = None
    staff_id: Optional[int] = None
    deadline: Optional[date] = None
    form_data: Optional[Dict[str, Any]] = None


class TicketBrief(BaseModel):
    id: int
    title: str
    status: TicketStatus
    priority: TicketPriority
    category_id: Optional[int] = None
    student_id: int
    staff_id: Optional[int] = None
    deadline: Optional[date] = None
    form_data: Optional[Dict[str, Any]] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    nama: Optional[str] = None
    nim_or_nip: Optional[str] = None
    nama_kategori: Optional[str] = None

    class Config:
        from_attributes = True


class TicketResponse(BaseModel):
    id: int
    title: str
    description: str
    status: TicketStatus
    priority: TicketPriority
    category_id: Optional[int] = None
    student_id: int
    student_name: Optional[str] = None
    staff_id: Optional[int] = None
    staff_name: Optional[str] = None
    deadline: Optional[date] = None
    form_data: Optional[Dict[str, Any]] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True