from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.ticket import Ticket
from app.models.user import User
from app.models.faq import FAQ
from app.models.category import Category
from app.models.enums import TicketStatus, UserRole, FaqStatus
from datetime import datetime, timedelta, timezone


class StatsService:
    def __init__(self, db: Session):
        self.db = db

    def get_dashboard(self) -> dict:
        return {
            "tickets_by_status": self._tickets_by_status(),
            "tickets_by_category": self._tickets_by_category(),
            "users_by_role": self._users_by_role(),
            "faqs_by_status": self._faqs_by_status(),
            "recent_tickets": self._recent_tickets(),
            "total_tickets": self.db.query(Ticket).count(),
            "total_users": self.db.query(User).count(),
            "total_faqs": self.db.query(FAQ).count(),
            "total_categories": self.db.query(Category).count(),
        }

    def _tickets_by_status(self) -> dict:
        rows = (
            self.db.query(Ticket.status, func.count(Ticket.id))
            .group_by(Ticket.status)
            .all()
        )
        return {status.value: count for status, count in rows}

    def _tickets_by_category(self) -> list[dict]:
        rows = (
            self.db.query(Category.name, func.count(Ticket.id))
            .outerjoin(Ticket, Ticket.category_id == Category.id)
            .group_by(Category.name)
            .all()
        )
        return [{"category": name, "count": count} for name, count in rows]

    def _users_by_role(self) -> dict:
        rows = (
            self.db.query(User.role, func.count(User.id))
            .group_by(User.role)
            .all()
        )
        return {role.value: count for role, count in rows}

    def _faqs_by_status(self) -> dict:
        rows = (
            self.db.query(FAQ.status, func.count(FAQ.id))
            .group_by(FAQ.status)
            .all()
        )
        return {status.value: count for status, count in rows}

    def _recent_tickets(self, days: int = 7) -> int:
        cutoff = datetime.now(timezone.utc) - timedelta(days=days)
        return self.db.query(Ticket).filter(Ticket.created_at >= cutoff).count()
