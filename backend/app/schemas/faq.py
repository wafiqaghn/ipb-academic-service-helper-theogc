from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.enums import FaqStatus

class FaqBase(BaseModel):
    question: str
    answer: str
    status: Optional[FaqStatus] = FaqStatus.draft
    category_id: Optional[int] = None

class FaqCreate(FaqBase):
    pass

class FaqUpdate(BaseModel):
    question: Optional[str] = None
    answer: Optional[str] = None
    status: Optional[FaqStatus] = None
    category_id: Optional[int] = None

class FaqResponse(FaqBase):
    id: int
    view_count: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
