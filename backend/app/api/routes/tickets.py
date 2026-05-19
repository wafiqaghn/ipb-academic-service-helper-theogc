"""Ticket routes: user submit/track + staff process/filter."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.api.deps import get_current_user, require_roles
from app.models.enums import TicketStatus, TicketPriority, UserRole
from app.models.user import User
from app.schemas.ticket import (
    TicketCreate, TicketUpdate, TicketBrief, TicketResponse,
    TicketNoteCreate, TicketNoteResponse,
)
from app.services.ticket_service import TicketService

router = APIRouter(prefix="/tickets", tags=["Tickets"])


def _get_ticket_service(db: Session = Depends(get_db)) -> TicketService:
    return TicketService(db)


# ── User Endpoints ──────────────────────────────────────

@router.post("", response_model=TicketBrief)
def create_ticket(
    payload: TicketCreate,
    current_user: User = Depends(get_current_user),
    service: TicketService = Depends(_get_ticket_service),
) -> TicketBrief:
    """Submit a new service request."""
    ticket = service.create(current_user, payload)
    return ticket


@router.get("/me", response_model=list[TicketBrief])
def my_tickets(
    status: TicketStatus | None = None,
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    service: TicketService = Depends(_get_ticket_service),
) -> list[TicketBrief]:
    """Track my own service requests."""
    return service.list_my_tickets(current_user, status, skip, limit)


@router.get("/{ticket_id}", response_model=TicketResponse)
def get_ticket(
    ticket_id: int,
    current_user: User = Depends(get_current_user),
    service: TicketService = Depends(_get_ticket_service),
) -> TicketResponse:
    """View ticket details (user sees own, staff/admin sees all)."""
    ticket = service.get_detail(ticket_id, current_user)
    # Build response with nested names
    return _ticket_to_response(ticket)


# ── Staff / Admin Endpoints ────────────────────────────

@router.get("", response_model=list[TicketBrief])
def list_all_tickets(
    status: TicketStatus | None = None,
    priority: TicketPriority | None = None,
    category_id: int | None = None,
    assigned_to: int | None = None,
    skip: int = 0,
    limit: int = 50,
    _: User = Depends(require_roles(UserRole.staff, UserRole.admin)),
    service: TicketService = Depends(_get_ticket_service),
) -> list[TicketBrief]:
    """Staff/Admin: list all tickets with filters."""
    return service.list_all(status, priority, category_id, assigned_to, skip, limit)


@router.patch("/{ticket_id}", response_model=TicketBrief)
def update_ticket(
    ticket_id: int,
    payload: TicketUpdate,
    _: User = Depends(require_roles(UserRole.staff, UserRole.admin)),
    service: TicketService = Depends(_get_ticket_service),
) -> TicketBrief:
    """Staff/Admin: update ticket status, priority, or assignment."""
    return service.update(ticket_id, payload)


# ── Notes ───────────────────────────────────────────────

@router.post("/{ticket_id}/notes", response_model=TicketNoteResponse)
def add_note(
    ticket_id: int,
    payload: TicketNoteCreate,
    current_user: User = Depends(require_roles(UserRole.staff, UserRole.admin)),
    service: TicketService = Depends(_get_ticket_service),
) -> TicketNoteResponse:
    """Staff/Admin: add a note to a ticket."""
    note = service.add_note(ticket_id, current_user, payload)
    return TicketNoteResponse(
        id=note.id,
        ticket_id=note.ticket_id,
        author_id=note.author_id,
        author_name=note.author.name if note.author else None,
        content=note.content,
        created_at=note.created_at,
    )


@router.get("/{ticket_id}/notes", response_model=list[TicketNoteResponse])
def list_notes(
    ticket_id: int,
    _: User = Depends(require_roles(UserRole.staff, UserRole.admin)),
    service: TicketService = Depends(_get_ticket_service),
) -> list[TicketNoteResponse]:
    """Staff/Admin: view all notes on a ticket."""
    notes = service.list_notes(ticket_id)
    return [
        TicketNoteResponse(
            id=n.id,
            ticket_id=n.ticket_id,
            author_id=n.author_id,
            author_name=n.author.name if n.author else None,
            content=n.content,
            created_at=n.created_at,
        )
        for n in notes
    ]


# ── Helpers ─────────────────────────────────────────────

def _ticket_to_response(ticket) -> TicketResponse:
    return TicketResponse(
        id=ticket.id,
        subject=ticket.subject,
        description=ticket.description,
        status=ticket.status,
        priority=ticket.priority,
        category_id=ticket.category_id,
        created_by=ticket.created_by,
        creator_name=ticket.creator.name if ticket.creator else None,
        assigned_to=ticket.assigned_to,
        assignee_name=ticket.assignee.name if ticket.assignee else None,
        created_at=ticket.created_at,
        updated_at=ticket.updated_at,
        notes=[
            TicketNoteResponse(
                id=n.id,
                ticket_id=n.ticket_id,
                author_id=n.author_id,
                author_name=n.author.name if n.author else None,
                content=n.content,
                created_at=n.created_at,
            )
            for n in (ticket.notes or [])
        ],
        attachments=[
            {
                "id": a.id,
                "ticket_id": a.ticket_id,
                "filename": a.filename,
                "filepath": a.filepath,
                "uploaded_at": a.uploaded_at,
            }
            for a in (ticket.attachments or [])
        ],
    )
