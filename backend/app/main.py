import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database.session import engine, Base

# Import ALL models so Base.metadata.create_all() discovers them
from app.models.user import User
from app.models.faq import FAQ
from app.models.category import Category
from app.models.ticket import Ticket
from app.models.ticket_note import TicketNote
from app.models.attachment import Attachment
from app.models.discussion import Discussion, DiscussionReply

# Import all routers
from app.api.routes import auth, faqs, categories, tickets, uploads, discussions, admin

# Uploads folder
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[STARTUP] Connecting to the PostgreSQL Database...")
    Base.metadata.create_all(bind=engine)
    print("[STARTUP] Tables created successfully. Server is ready!")

    yield

    print("[SHUTDOWN] Shutting down server...")


# INISIALISASI FASTAPI
app = FastAPI(
    title="IPB Academic Help Center API",
    description="Backend IPB Academic Help Center API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS MIDDLEWARE
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MOUNT FILE STATIS
app.mount("/files", StaticFiles(directory=UPLOAD_DIR), name="files")


# ── Health & Root ───────────────────────────────────────

@app.get("/")
def read_root():
    return {"message": "Backend IPB Academic Help Center Berhasil Menyala!"}


@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "connected"}


# ── Register All Routers ───────────────────────────────

API = "/api/v1"
app.include_router(auth.router,         prefix=API, tags=["Authentication"])
app.include_router(faqs.router,         prefix=API, tags=["FAQs"])
app.include_router(categories.router,   prefix=API, tags=["Categories"])
app.include_router(tickets.router,      prefix=API, tags=["Tickets"])
app.include_router(uploads.router,      prefix=API, tags=["Uploads"])
app.include_router(discussions.router,  prefix=API, tags=["Discussions"])
app.include_router(admin.router,        prefix=API, tags=["Admin Dashboard"])