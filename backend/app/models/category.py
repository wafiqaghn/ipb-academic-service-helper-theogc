from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.database.session import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    nama_kategori = Column(String, unique=True, nullable=False)
    deskripsi = Column(Text, nullable=True)
    
    icon = Column(String, default="📄", nullable=False)
    bg_color = Column(String, default="#F1EFE8", nullable=False)
    type = Column(String, default="manual", nullable=False)
    template = Column(Text, nullable=True)
    ttd = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())