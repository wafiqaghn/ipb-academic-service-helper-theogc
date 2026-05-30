import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database.session import engine, Base, SessionLocal
from app.models.user import User
from app.models.enums import UserRole
from app.core.security import hash_password
from app.models.faq import FAQ
from app.models.category import Category
from app.models.ticket import Ticket
from app.models.ticket_note import TicketNote
from app.models.attachment import Attachment
from app.models.discussion import Discussion, DiscussionReply

from app.controllers import auth_controller, ticket_controller, faq_controller, category_controller

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[STARTUP] Connecting to the PostgreSQL Database...")
    Base.metadata.create_all(bind=engine)
    print("[STARTUP] Tables created successfully. Server is ready!")

    print("[STARTUP] Seeding demo accounts...")
    db = SessionLocal()
    try:
        demo_accounts = [
            {"email": "quina@apps.ipb.ac.id", "nama": "Quina", "nim_or_nip": "G6401231013", "password": "Password123!", "role": UserRole.mahasiswa},
            {"email": "staff@apps.ipb.ac.id", "nama": "Staff", "nim_or_nip": "NIP12345678", "password": "Password123!", "role": UserRole.staff},
            {"email": "admin@apps.ipb.ac.id", "nama": "Admin", "nim_or_nip": "NIP87654321", "password": "Password123!", "role": UserRole.admin}
        ]
        
        for account in demo_accounts:
            existing = db.query(User).filter(User.email == account["email"]).first()
            if not existing:
                new_user = User(
                    email=account["email"],
                    nama=account["nama"],
                    nim_or_nip=account["nim_or_nip"],
                    hashed_password=hash_password(account["password"]),
                    role=account["role"]
                )
                db.add(new_user)
        
        db.commit()
        print("[STARTUP] Seeding completed.")
    except Exception as e:
        print(f"[STARTUP] Seeding error: {e}")
    finally:
        db.close()

    yield

    print("[SHUTDOWN] Shutting down server...")

app = FastAPI(
    title="IPB Academic Help Center API",
    description="Backend IPB Academic Help Center API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/files", StaticFiles(directory=UPLOAD_DIR), name="files")

@app.get("/")
def read_root():
    return {"message": "Backend IPB Academic Help Center Berhasil Menyala!"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "connected"}

API = "/api/v1"
app.include_router(auth_controller.router,       prefix=API)
app.include_router(faq_controller.router,        prefix=API)
app.include_router(category_controller.router,   prefix=API)
app.include_router(ticket_controller.router,     prefix=API)