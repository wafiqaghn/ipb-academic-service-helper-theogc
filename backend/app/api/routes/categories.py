from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.api.deps import require_roles
from app.models.enums import UserRole
from app.models.user import User
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.services.category_service import CategoryService

router = APIRouter(prefix="/categories", tags=["Categories"])


def _get_category_service(db: Session = Depends(get_db)) -> CategoryService:
    return CategoryService(db)


@router.get("", response_model=list[CategoryResponse])
def list_categories(
    service: CategoryService = Depends(_get_category_service),
) -> list[CategoryResponse]:
    return service.list_all()


@router.post("", response_model=CategoryResponse)
def create_category(
    payload: CategoryCreate,
    _: User = Depends(require_roles(UserRole.admin)),
    service: CategoryService = Depends(_get_category_service),
) -> CategoryResponse:
    return service.create(payload)


@router.patch("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    payload: CategoryUpdate,
    _: User = Depends(require_roles(UserRole.admin)),
    service: CategoryService = Depends(_get_category_service),
) -> CategoryResponse:
    return service.update(category_id, payload)


@router.delete("/{category_id}")
def delete_category(
    category_id: int,
    _: User = Depends(require_roles(UserRole.admin)),
    service: CategoryService = Depends(_get_category_service),
) -> dict:
    return service.delete(category_id)