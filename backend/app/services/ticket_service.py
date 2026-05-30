from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.ticket import Ticket
from app.models.ticket_note import TicketNote
from app.models.user import User
from app.models.enums import TicketStatus, TicketPriority, UserRole
from app.schemas.ticket import TicketCreate, TicketUpdate, TicketNoteCreate


class TicketService:
    def __init__(self, db: Session):
        self.db = db

    def create(self, user: User, payload: TicketCreate) -> Ticket:
        ticket = Ticket(
            subject=payload.subject,
            description=payload.description,
            category_id=payload.category_id,
            priority=payload.priority,
            deadline=payload.deadline,
            form_data=payload.form_data,
            created_by=user.id,
        )
        self.db.add(ticket)
        self.db.commit()
        self.db.refresh(ticket)
        return ticket

    def list_my_tickets(
        self,
        user: User,
        status_filter: TicketStatus | None = None,
        skip: int = 0,
        limit: int = 50,
    ) -> list[Ticket]:
        query = self.db.query(Ticket).filter(Ticket.created_by == user.id)
        if status_filter:
            query = query.filter(Ticket.status == status_filter)
        return query.order_by(Ticket.created_at.desc()).offset(skip).limit(limit).all()

    def get_detail(self, ticket_id: int, user: User) -> Ticket:
        ticket = self.db.query(Ticket).filter(Ticket.id == ticket_id).first()
        if not ticket:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Ticket not found"
            )
        if user.role == UserRole.mahasiswa and ticket.created_by != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only view your own tickets"
            )
        return ticket

    def list_all(
        self,
        status_filter: TicketStatus | None = None,
        priority_filter: TicketPriority | None = None,
        category_id: int | None = None,
        assigned_to: int | None = None,
        skip: int = 0,
        limit: int = 50,
    ) -> list[Ticket]:
        query = self.db.query(Ticket)
        if status_filter:
            query = query.filter(Ticket.status == status_filter)
        if priority_filter:
            query = query.filter(Ticket.priority == priority_filter)
        if category_id:
            query = query.filter(Ticket.category_id == category_id)
        if assigned_to:
            query = query.filter(Ticket.assigned_to == assigned_to)
        return query.order_by(Ticket.created_at.desc()).offset(skip).limit(limit).all()

    def update(self, ticket_id: int, payload: TicketUpdate) -> Ticket:
        ticket = self.db.query(Ticket).filter(Ticket.id == ticket_id).first()
        if not ticket:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Ticket not found"
            )
        update_data = payload.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(ticket, key, value)
        self.db.commit()
        self.db.refresh(ticket)
        return ticket

    def add_note(self, ticket_id: int, user: User, payload: TicketNoteCreate) -> TicketNote:
        ticket = self.db.query(Ticket).filter(Ticket.id == ticket_id).first()
        if not ticket:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Ticket not found"
            )
        note = TicketNote(
            ticket_id=ticket_id,
            author_id=user.id,
            content=payload.content,
        )
        self.db.add(note)
        self.db.commit()
        self.db.refresh(note)
        return note

    def list_notes(self, ticket_id: int) -> list[TicketNote]:
        return (
            self.db.query(TicketNote)
            .filter(TicketNote.ticket_id == ticket_id)
            .order_by(TicketNote.created_at.asc())
            .all()
        )