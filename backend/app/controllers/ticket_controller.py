from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from app.database.session import get_db
from app.api.deps import get_current_user, require_roles
from app.models.enums import TicketStatus, UserRole
from app.models.ticket import Ticket
from app.models.user import User
from app.schemas.ticket import TicketCreate, TicketUpdate, TicketBrief, TicketResponse
from typing import List

router = APIRouter(prefix="/tickets", tags=["Tickets"])

@router.post("", response_model=TicketBrief)
def create_ticket(
    payload: TicketCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        new_ticket = Ticket(
            title=payload.title,
            description=payload.description,
            category_id=payload.category_id,
            priority=payload.priority,
            deadline=payload.deadline,
            form_data=payload.form_data,
            student_id=current_user.id
        )
        db.add(new_ticket)
        db.commit()
        db.refresh(new_ticket)
        return new_ticket
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/my", response_model=List[TicketBrief])
def get_my_tickets(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        tickets = db.query(Ticket).filter(Ticket.student_id == current_user.id).all()
        return tickets
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/all", response_model=List[TicketBrief])
def get_all_tickets(
    _: User = Depends(require_roles(UserRole.staff, UserRole.admin)),
    db: Session = Depends(get_db),
):
    try:
        tickets = db.query(Ticket).all()
        return tickets
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/{ticket_id}", response_model=TicketResponse)
def get_ticket_detail(
    ticket_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
        if not ticket:
            raise HTTPException(status_code=404, detail="Ticket not found")
        
        if current_user.role == UserRole.mahasiswa and ticket.student_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to view this ticket")

        return TicketResponse(
            id=ticket.id,
            title=ticket.title,
            description=ticket.description,
            status=ticket.status,
            priority=ticket.priority,
            category_id=ticket.category_id,
            student_id=ticket.student_id,
            student_name=ticket.student.nama if ticket.student else None,
            staff_id=ticket.staff_id,
            staff_name=ticket.staff.nama if ticket.staff else None,
            deadline=ticket.deadline,
            form_data=ticket.form_data,
            created_at=ticket.created_at,
            updated_at=ticket.updated_at
        )
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.patch("/{ticket_id}/status", response_model=TicketBrief)
def update_ticket_status(
    ticket_id: int,
    payload: TicketUpdate,
    current_user: User = Depends(require_roles(UserRole.staff, UserRole.admin)),
    db: Session = Depends(get_db),
):
    try:
        ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
        if not ticket:
            raise HTTPException(status_code=404, detail="Ticket not found")
        
        if payload.status:
            ticket.status = payload.status
        if payload.staff_id:
            ticket.staff_id = payload.staff_id
        if payload.priority:
            ticket.priority = payload.priority
        
        if not ticket.staff_id and payload.status and payload.status != TicketStatus.open:
            ticket.staff_id = current_user.id

        db.commit()
        db.refresh(ticket)
        return ticket
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")