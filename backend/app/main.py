import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# LOGIKA PEMBUATAN FOLDER
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[STARTUP] Backend menyala dengan folder upload yang siap!")
    yield
    print("[SHUTDOWN] Mematikan server...")

# INISIALISASI FASTAPI (MURNI MOCK)
app = FastAPI(
    title="IPB Academic Help Center - Mock API",
    description="API sementara untuk frontend karena file utama belum di-push PM",
    version="1.0.0",
    lifespan=lifespan
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

# ==========================================
# ROUTE / ENDPOINT JALUR PINTAS (MOCK)
# ==========================================

@app.get("/")
def read_root():
    return {"message": "Backend IPB Academic Help Center Berhasil Menyala!"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "connected (mock)"}

@app.post("/api/v1/auth/login")
def mock_login():
    return {"access_token": "mock_jwt_token_cici", "token_type": "bearer"}

@app.get("/api/v1/auth/me")
def mock_me():
    return {"email": "winanci@apps.ipb.ac.id", "role": "mahasiswa", "name": "Cici"}



# import os
# from contextlib import asynccontextmanager
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.staticfiles import StaticFiles

# from app.database.session import engine, Base

# # import controllers utama
# from app.controllers import (
#     auth_controller,
#     ticket_controller,
#     category_controller,
#     faq_controller,
#     discussion_controller,
#     notification_controller,
#     upload_controller,
#     admin_controller
# )

# UPLOAD_DIR = "uploads"

# if not os.path.exists(UPLOAD_DIR):
#     os.makedirs(UPLOAD_DIR)

# # 1. LIFESPAN
# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     # tabel dibuat otomatis pas startup aplikasi
#     print("[STARTUP] Menghubungkan ke database dan membuat tabel...")
#     Base.metadata.create_all(bind=engine)
        
#     yield
#     print("[SHUTDOWN] Mematikan aplikasi dan membersihkan koneksi...")

# # 2. INISIALISASI FASTAPI
# app = FastAPI(
#     title="IPB Academic Help Center API",
#     description="Backend API Portal Bantuan Akademik IPB University (Semester 6 ADS Project)",
#     version="1.0.0",
#     lifespan=lifespan
# )

# # 3. CORS MIDDLEWARE
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # 4. MOUNT FILE STATIS (utk fitur unggah lampiran tiket)
# app.mount("/files", StaticFiles(directory=UPLOAD_DIR), name="files")


# # 5. HEALTH CHECK ENDPOINT
# @app.get("/health", tags=["Infrastructure"])
# def health_check():
#     return {"status": "healthy", "service": "IPB Academic Help Center Backend"}


# # 6. REGISTER ROUTERS
# API_PREFIX = "/api/v1"

# app.include_router(auth_controller.router, prefix=API_PREFIX, tags=["Authentication"])
# app.include_router(category_controller.router, prefix=API_PREFIX, tags=["Categories"])
# app.include_router(ticket_controller.router, prefix=API_PREFIX, tags=["Tickets"])
# app.include_router(faq_controller.router, prefix=API_PREFIX, tags=["FAQs"])
# app.include_router(discussion_controller.router, prefix=API_PREFIX, tags=["Discussions"])
# app.include_router(notification_controller.router, prefix=API_PREFIX, tags=["Notifications"])
# app.include_router(upload_controller.router, prefix=API_PREFIX, tags=["Uploads"])
# app.include_router(admin_controller.router, prefix=API_PREFIX, tags=["Admin Analytics"])