from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.faq import FAQ
from app.models.enums import FaqStatus, UserRole
from app.schemas.faq import FaqCreate, FaqUpdate

class FaqService:
    def __init__(self, db: Session):
        self.db = db

    def list_public(self, category_id: int | None, search: str | None, skip: int, limit: int):
        query = self.db.query(FAQ).filter(FAQ.status == FaqStatus.published)
        if category_id:
            query = query.filter(FAQ.category_id == category_id)
        if search:
            query = query.filter(FAQ.question.ilike(f"%{search}%"))
        return query.offset(skip).limit(limit).all()

    def popular(self):
        return self.db.query(FAQ).filter(FAQ.status == FaqStatus.published).order_by(FAQ.view_count.desc()).limit(5).all()

    def bump_popular(self, faq_id: int):
        faq = self.db.query(FAQ).filter(FAQ.id == faq_id).first()
        if faq:
            faq.view_count += 1
            self.db.commit()

    def list_admin(self, category_id: int | None, status: FaqStatus | None, search: str | None, skip: int, limit: int):
        query = self.db.query(FAQ)
        if category_id:
            query = query.filter(FAQ.category_id == category_id)
        if status:
            query = query.filter(FAQ.status == status)
        if search:
            query = query.filter(FAQ.question.ilike(f"%{search}%"))
        return query.offset(skip).limit(limit).all()

    def create(self, role: UserRole, payload: FaqCreate):
        faq = FAQ(**payload.model_dump())
        self.db.add(faq)
        self.db.commit()
        self.db.refresh(faq)
        return faq

    def update(self, role: UserRole, faq_id: int, payload: FaqUpdate):
        faq = self.db.query(FAQ).filter(FAQ.id == faq_id).first()
        if not faq:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="FAQ not found")
        
        update_data = payload.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(faq, key, value)
            
        self.db.commit()
        self.db.refresh(faq)
        return faq