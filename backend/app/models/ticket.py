from sqlalchemy import Column, Integer, String, Text, DateTime, Date, JSON, ForeignKey, Enum as SQLEnum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.session import Base
from app.models.enums import TicketStatus, TicketPriority


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    status = Column(SQLEnum(TicketStatus), default=TicketStatus.open, nullable=False)
    priority = Column(SQLEnum(TicketPriority), default=TicketPriority.medium, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    deadline = Column(Date, nullable=True)
    form_data = Column(JSON, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    creator = relationship("User", foreign_keys=[created_by], lazy="joined")
    assignee = relationship("User", foreign_keys=[assigned_to], lazy="joined")
    category = relationship("Category", lazy="joined")
    notes = relationship("TicketNote", back_populates="ticket", lazy="joined")
    attachments = relationship("Attachment", back_populates="ticket", lazy="joined")