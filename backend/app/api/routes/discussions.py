"""Discussion forum routes."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.discussion import (
    DiscussionCreate, DiscussionResponse,
    ReplyCreate, ReplyResponse,
)
from app.services.discussion_service import DiscussionService

router = APIRouter(prefix="/discussions", tags=["Discussions"])


def _get_discussion_service(db: Session = Depends(get_db)) -> DiscussionService:
    return DiscussionService(db)


@router.post("", response_model=DiscussionResponse)
def create_discussion(
    payload: DiscussionCreate,
    current_user: User = Depends(get_current_user),
    service: DiscussionService = Depends(_get_discussion_service),
) -> DiscussionResponse:
    """Open a new discussion thread on an FAQ."""
    discussion = service.create_thread(current_user, payload)
    return DiscussionResponse(
        id=discussion.id,
        faq_id=discussion.faq_id,
        author_id=discussion.author_id,
        author_name=discussion.author.name if discussion.author else None,
        content=discussion.content,
        created_at=discussion.created_at,
        reply_count=0,
    )


@router.get("", response_model=list[DiscussionResponse])
def list_discussions(
    faq_id: int,
    service: DiscussionService = Depends(_get_discussion_service),
) -> list[DiscussionResponse]:
    """List all discussion threads for a specific FAQ."""
    discussions = service.list_by_faq(faq_id)
    return [
        DiscussionResponse(
            id=d.id,
            faq_id=d.faq_id,
            author_id=d.author_id,
            author_name=d.author.name if d.author else None,
            content=d.content,
            created_at=d.created_at,
            reply_count=len(d.replies) if d.replies else 0,
        )
        for d in discussions
    ]


@router.post("/{discussion_id}/replies", response_model=ReplyResponse)
def add_reply(
    discussion_id: int,
    payload: ReplyCreate,
    current_user: User = Depends(get_current_user),
    service: DiscussionService = Depends(_get_discussion_service),
) -> ReplyResponse:
    """Reply to a discussion thread."""
    reply = service.add_reply(discussion_id, current_user, payload)
    return ReplyResponse(
        id=reply.id,
        discussion_id=reply.discussion_id,
        author_id=reply.author_id,
        author_name=reply.author.name if reply.author else None,
        content=reply.content,
        created_at=reply.created_at,
    )


@router.get("/{discussion_id}/replies", response_model=list[ReplyResponse])
def list_replies(
    discussion_id: int,
    service: DiscussionService = Depends(_get_discussion_service),
) -> list[ReplyResponse]:
    """Get all replies for a discussion thread."""
    replies = service.list_replies(discussion_id)
    return [
        ReplyResponse(
            id=r.id,
            discussion_id=r.discussion_id,
            author_id=r.author_id,
            author_name=r.author.name if r.author else None,
            content=r.content,
            created_at=r.created_at,
        )
        for r in replies
    ]
