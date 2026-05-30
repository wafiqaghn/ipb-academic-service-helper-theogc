from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.discussion import Discussion, DiscussionReply
from app.models.faq import FAQ
from app.models.user import User
from app.schemas.discussion import DiscussionCreate, ReplyCreate


class DiscussionService:
    def __init__(self, db: Session):
        self.db = db

    def create_thread(self, user: User, payload: DiscussionCreate) -> Discussion:
        faq = self.db.query(FAQ).filter(FAQ.id == payload.faq_id).first()
        if not faq:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="FAQ not found"
            )

        discussion = Discussion(
            faq_id=payload.faq_id,
            author_id=user.id,
            content=payload.content,
        )
        self.db.add(discussion)
        self.db.commit()
        self.db.refresh(discussion)
        return discussion

    def list_by_faq(self, faq_id: int) -> list[Discussion]:
        return (
            self.db.query(Discussion)
            .filter(Discussion.faq_id == faq_id)
            .order_by(Discussion.created_at.desc())
            .all()
        )

    def get_thread(self, discussion_id: int) -> Discussion:
        discussion = self.db.query(Discussion).filter(Discussion.id == discussion_id).first()
        if not discussion:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Discussion not found"
            )
        return discussion

    def add_reply(self, discussion_id: int, user: User, payload: ReplyCreate) -> DiscussionReply:
        discussion = self.get_thread(discussion_id)

        reply = DiscussionReply(
            discussion_id=discussion_id,
            author_id=user.id,
            content=payload.content,
        )
        self.db.add(reply)
        self.db.commit()
        self.db.refresh(reply)
        return reply

    def list_replies(self, discussion_id: int) -> list[DiscussionReply]:
        self.get_thread(discussion_id)
        return (
            self.db.query(DiscussionReply)
            .filter(DiscussionReply.discussion_id == discussion_id)
            .order_by(DiscussionReply.created_at.asc())
            .all()
        )