"""Admin dashboard routes."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.api.deps import require_roles
from app.models.enums import UserRole
from app.models.user import User
from app.services.stats_service import StatsService

router = APIRouter(prefix="/admin", tags=["Admin Dashboard"])


def _get_stats_service(db: Session = Depends(get_db)) -> StatsService:
    return StatsService(db)


@router.get("/stats")
def dashboard_stats(
    _: User = Depends(require_roles(UserRole.admin)),
    service: StatsService = Depends(_get_stats_service),
) -> dict:
    """Admin only: get full dashboard statistics."""
    return service.get_dashboard()
