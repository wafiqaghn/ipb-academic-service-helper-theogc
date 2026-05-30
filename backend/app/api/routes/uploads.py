import os
import uuid
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.ticket import Ticket
from app.models.attachment import Attachment
from app.schemas.ticket import AttachmentResponse

router = APIRouter(prefix="/tickets", tags=["Uploads"])

UPLOAD_DIR = "uploads"


def _get_db(db: Session = Depends(get_db)):
    return db


@router.post("/{ticket_id}/attachments", response_model=AttachmentResponse)
def upload_attachment(
    ticket_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> AttachmentResponse:
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )

    from app.models.enums import UserRole
    if current_user.role == UserRole.mahasiswa and ticket.created_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only upload files to your own tickets"
        )

    ext = os.path.splitext(file.filename or "file")[1]
    unique_name = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(UPLOAD_DIR, unique_name)

    with open(filepath, "wb") as f:
        content = file.file.read()
        f.write(content)

    attachment = Attachment(
        ticket_id=ticket_id,
        filename=file.filename or "unknown",
        filepath=f"/files/{unique_name}",
    )
    db.add(attachment)
    db.commit()
    db.refresh(attachment)
    return attachment


@router.get("/{ticket_id}/attachments", response_model=list[AttachmentResponse])
def list_attachments(
    ticket_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[AttachmentResponse]:
    """List all attachments for a ticket."""
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )

    from app.models.enums import UserRole
    if current_user.role == UserRole.mahasiswa and ticket.created_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view attachments of your own tickets"
        )

    return db.query(Attachment).filter(Attachment.ticket_id == ticket_id).all()