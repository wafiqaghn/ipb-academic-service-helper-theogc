"""FAQ routes."""

from fastapi import APIRouter, Depends

from app.api.deps import get_current_user, get_faq_service, require_roles
from app.models.enums import FaqStatus, UserRole
from app.models.user import User
from app.schemas.faq import FaqCreate, FaqResponse, FaqUpdate
from app.services.faq_service import FaqService

router = APIRouter(prefix="/faqs", tags=["faqs"])


@router.get("/public", response_model=list[FaqResponse])
def list_public(
    category_id: int | None = None,
    search: str | None = None,
    service: FaqService = Depends(get_faq_service),
) -> list[FaqResponse]:
    return service.list_public(category_id, search, 0, 200)


@router.get("/popular", response_model=list[FaqResponse])
def popular(service: FaqService = Depends(get_faq_service)) -> list[FaqResponse]:
    return service.popular()


@router.post("/{faq_id}/view")
def track_view(faq_id: int, service: FaqService = Depends(get_faq_service)) -> dict:
    service.bump_popular(faq_id)
    return {"ok": True}


@router.get("/admin", response_model=list[FaqResponse])
def list_admin(
    category_id: int | None = None,
    status: FaqStatus | None = None,
    search: str | None = None,
    _: User = Depends(require_roles(UserRole.staff, UserRole.admin)),
    service: FaqService = Depends(get_faq_service),
) -> list[FaqResponse]:
    return service.list_admin(category_id, status, search, 0, 500)


@router.post("", response_model=FaqResponse)
def create_faq(
    payload: FaqCreate,
    current: User = Depends(require_roles(UserRole.staff, UserRole.admin)),
    service: FaqService = Depends(get_faq_service),
) -> FaqResponse:
    return service.create(current.role, payload)


@router.patch("/{faq_id}", response_model=FaqResponse)
def update_faq(
    faq_id: int,
    payload: FaqUpdate,
    current: User = Depends(require_roles(UserRole.staff, UserRole.admin)),
    service: FaqService = Depends(get_faq_service),
) -> FaqResponse:
    return service.update(current.role, faq_id, payload)
