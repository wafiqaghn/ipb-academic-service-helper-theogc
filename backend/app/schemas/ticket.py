from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.enums import TicketStatus, TicketPriority, UserRole


# ── Ticket ──────────────────────────────────────────────

class TicketCreate(BaseModel):
    subject: str
    description: str
    category_id: Optional[int] = None
    priority: Optional[TicketPriority] = TicketPriority.medium


class TicketUpdate(BaseModel):
    status: Optional[TicketStatus] = None
    priority: Optional[TicketPriority] = None
    assigned_to: Optional[int] = None


class TicketBrief(BaseModel):
    """Lightweight ticket representation for list views."""
    id: int
    subject: str
    status: TicketStatus
    priority: TicketPriority
    category_id: Optional[int] = None
    created_by: int
    assigned_to: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Ticket Notes ────────────────────────────────────────

class TicketNoteCreate(BaseModel):
    content: str


class TicketNoteResponse(BaseModel):
    id: int
    ticket_id: int
    author_id: int
    author_name: Optional[str] = None
    content: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Attachment ──────────────────────────────────────────

class AttachmentResponse(BaseModel):
    id: int
    ticket_id: int
    filename: str
    filepath: str
    uploaded_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Full Ticket Detail ─────────────────────────────────

class TicketResponse(BaseModel):
    id: int
    subject: str
    description: str
    status: TicketStatus
    priority: TicketPriority
    category_id: Optional[int] = None
    created_by: int
    creator_name: Optional[str] = None
    assigned_to: Optional[int] = None
    assignee_name: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    notes: list[TicketNoteResponse] = []
    attachments: list[AttachmentResponse] = []

    class Config:
        from_attributes = True
