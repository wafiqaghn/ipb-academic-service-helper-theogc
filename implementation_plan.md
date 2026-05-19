# IPB Academic Help Center — Full Backend Implementation Plan

## Gap Analysis: Use Case Diagram vs Current Code

| Use Case | Status | What's Missing |
|---|---|---|
| **View FAQ** | ✅ Partial | Routes exist, but `category_id` has no FK to a `categories` table |
| **Search FAQ** | ✅ Done | `list_public` has `search` param |
| **Open Discussion Forum** | ❌ Not started | No model, schema, route, or service |
| **Submit Service Request** | ❌ Not started | No ticket/request model at all |
| **Fill Request Form** | ❌ Not started | Part of Submit Service Request |
| **Upload Supporting Documents** | ❌ Not started | Upload folder exists, but no upload route |
| **Track Request** | ❌ Not started | No ticket tracking endpoint |
| **View Details** | ❌ Not started | Part of Track Request |
| **Process Request Service** | ❌ Not started | Staff ticket processing |
| **Update Status** | ❌ Not started | Part of Process Request |
| **Assign to Staff** | ❌ Not started | Part of Process Request |
| **Add Notes** | ❌ Not started | No notes model |
| **Filter Request** | ❌ Not started | Staff filtering tickets |
| **Manage FAQ Content** | ✅ Partial | Create/Update exist, but admin list needs work |
| **Edit / Add / Publish FAQ** | ✅ Done | Covered by existing FAQ routes |
| **Manage Categories** | ❌ Not started | No category model/routes |
| **Monitor Statistics** | ❌ Not started | No dashboard/stats endpoint |
| **Dashboard** | ❌ Not started | Part of Monitor Statistics |
| **Real Authentication** | ❌ Mock only | `deps.py` returns a hardcoded user |

---

## Phase 1: Fix Enums & User Model (add password + timestamps)

### [MODIFY] [enums.py](file:///c:/Users/winan/OneDrive/Documents/IPB%20-%20S1/Semester%206/ADS/Project%20ADS/ipb-academic-service-helper-theogc/backend/app/models/enums.py)
Add two new enums:
```python
import enum

class UserRole(str, enum.Enum):
    mahasiswa = "mahasiswa"
    staff = "staff"
    admin = "admin"

class FaqStatus(str, enum.Enum):
    draft = "draft"
    published = "published"
    archived = "archived"

class TicketStatus(str, enum.Enum):
    open = "open"
    in_progress = "in_progress"
    resolved = "resolved"
    closed = "closed"

class TicketPriority(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
```

### [MODIFY] [user.py](file:///c:/Users/winan/OneDrive/Documents/IPB%20-%20S1/Semester%206/ADS/Project%20ADS/ipb-academic-service-helper-theogc/backend/app/models/user.py)
Add `hashed_password` and `created_at` so users can actually log in:
```python
from sqlalchemy import Column, Integer, String, DateTime, Enum as SQLEnum
from sqlalchemy.sql import func
from app.database.session import Base
from app.models.enums import UserRole

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.mahasiswa, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
```

---

## Phase 2: Real Authentication (Replace Mock Login)

### [NEW] `backend/app/core/security.py`
Handles JWT token creation and password hashing:
```python
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from passlib.context import CryptContext
from app.core.config import get_settings

settings = get_settings()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

def decode_access_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    except JWTError:
        return None
```

### [NEW] `backend/app/schemas/auth.py`
```python
from pydantic import BaseModel, EmailStr
from app.models.enums import UserRole

class RegisterRequest(BaseModel):
    email: str
    name: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    role: UserRole

    class Config:
        from_attributes = True
```

### [NEW] `backend/app/services/auth_service.py`
Handles register, login, and get-me logic using real DB queries.

### [NEW] `backend/app/api/routes/auth.py`
Three endpoints:
- `POST /auth/register` — Create a new user
- `POST /auth/login` — Verify password, return JWT
- `GET /auth/me` — Decode JWT, return current user info

### [MODIFY] `backend/app/api/deps.py`
Replace the mock `get_current_user` with real JWT decoding:
```python
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.id == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user
```

---

## Phase 3: Categories (Admin manages, FAQ references)

### [NEW] `backend/app/models/category.py`
```python
class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
```

### [MODIFY] `backend/app/models/faq.py`
Add a ForeignKey so `category_id` actually points to the categories table:
```python
category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
```

### [NEW] `backend/app/schemas/category.py`
`CategoryCreate`, `CategoryUpdate`, `CategoryResponse`

### [NEW] `backend/app/services/category_service.py`
CRUD: list all, create, update, delete

### [NEW] `backend/app/api/routes/categories.py`
- `GET /categories` — List all (public)
- `POST /categories` — Create (Admin only)
- `PATCH /categories/{id}` — Update (Admin only)
- `DELETE /categories/{id}` — Delete (Admin only)

---

## Phase 4: Service Requests / Tickets (The Core Feature)

This is the biggest piece — "Submit Service Request", "Track Request", "Process Request Service".

### [NEW] `backend/app/models/ticket.py`
```python
class Ticket(Base):
    __tablename__ = "tickets"
    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    status = Column(SQLEnum(TicketStatus), default=TicketStatus.open)
    priority = Column(SQLEnum(TicketPriority), default=TicketPriority.medium)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

### [NEW] `backend/app/models/ticket_note.py`
Staff/Admin can add internal notes to a ticket:
```python
class TicketNote(Base):
    __tablename__ = "ticket_notes"
    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("tickets.id"), nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
```

### [NEW] `backend/app/models/attachment.py`
For "Upload Supporting Documents":
```python
class Attachment(Base):
    __tablename__ = "attachments"
    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("tickets.id"), nullable=False)
    filename = Column(String, nullable=False)
    filepath = Column(String, nullable=False)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
```

### [NEW] `backend/app/schemas/ticket.py`
- `TicketCreate` — subject, description, category_id, priority
- `TicketUpdate` — status, assigned_to, priority (Staff/Admin)
- `TicketResponse` — all fields + notes + attachments
- `TicketNoteCreate` — content
- `TicketNoteResponse` — content + author + timestamp

### [NEW] `backend/app/services/ticket_service.py`
- `create()` — User submits a new request
- `list_my_tickets()` — User sees their own tickets (Track Request)
- `get_detail()` — View ticket details
- `list_all()` — Staff/Admin sees all tickets (Filter Request)
- `update_status()` — Staff updates status
- `assign_staff()` — Admin assigns a staff member
- `add_note()` — Staff/Admin adds internal notes

### [NEW] `backend/app/api/routes/tickets.py`
- `POST /tickets` — Submit Service Request (User)
- `GET /tickets/me` — Track my requests (User)
- `GET /tickets/{id}` — View details (User who owns it, or Staff/Admin)
- `GET /tickets` — List all with filters (Staff/Admin)
- `PATCH /tickets/{id}` — Update status / assign (Staff/Admin)
- `POST /tickets/{id}/notes` — Add notes (Staff/Admin)
- `GET /tickets/{id}/notes` — View notes (Staff/Admin)

### [NEW] `backend/app/api/routes/uploads.py`
- `POST /tickets/{id}/attachments` — Upload a file to a ticket
- `GET /tickets/{id}/attachments` — List attachments for a ticket

---

## Phase 5: Discussion Forum

### [NEW] `backend/app/models/discussion.py`
```python
class Discussion(Base):
    __tablename__ = "discussions"
    id, faq_id (FK), author_id (FK), content, created_at

class DiscussionReply(Base):
    __tablename__ = "discussion_replies"
    id, discussion_id (FK), author_id (FK), content, created_at
```

### [NEW] `backend/app/schemas/discussion.py`
`DiscussionCreate`, `DiscussionResponse`, `ReplyCreate`, `ReplyResponse`

### [NEW] `backend/app/services/discussion_service.py`
- `create_thread()` — Open a discussion on an FAQ
- `list_by_faq()` — Get all discussions for an FAQ
- `add_reply()` — Reply to a discussion

### [NEW] `backend/app/api/routes/discussions.py`
- `POST /discussions` — Open Discussion Forum
- `GET /discussions?faq_id=X` — List discussions for an FAQ
- `POST /discussions/{id}/replies` — Reply
- `GET /discussions/{id}/replies` — Get replies

---

## Phase 6: Admin Dashboard & Statistics

### [NEW] `backend/app/services/stats_service.py`
Queries that aggregate data for the dashboard:
- Total tickets by status (open, in_progress, resolved, closed)
- Total tickets by category
- Total users by role
- Total FAQs by status
- Recent tickets (last 7 days)

### [NEW] `backend/app/api/routes/admin.py`
- `GET /admin/stats` — Returns the full dashboard JSON (Admin only)

---

## Phase 7: Wire Everything into main.py

### [MODIFY] [main.py](file:///c:/Users/winan/OneDrive/Documents/IPB%20-%20S1/Semester%206/ADS/Project%20ADS/ipb-academic-service-helper-theogc/backend/app/main.py)

1. Import all new models so `Base.metadata.create_all()` discovers them
2. Import and register all new routers
3. Delete the old mock endpoints and commented-out code

```python
from app.api.routes import auth, faqs, categories, tickets, uploads, discussions, admin

# ... after app setup ...
API = "/api/v1"
app.include_router(auth.router,        prefix=API, tags=["Authentication"])
app.include_router(faqs.router,        prefix=API, tags=["FAQs"])
app.include_router(categories.router,  prefix=API, tags=["Categories"])
app.include_router(tickets.router,     prefix=API, tags=["Tickets"])
app.include_router(uploads.router,     prefix=API, tags=["Uploads"])
app.include_router(discussions.router, prefix=API, tags=["Discussions"])
app.include_router(admin.router,       prefix=API, tags=["Admin Dashboard"])
```

---

## Summary of ALL Files to Create

| # | File Path | Purpose |
|---|---|---|
| 1 | `app/core/security.py` | JWT + password hashing |
| 2 | `app/models/category.py` | Category DB table |
| 3 | `app/models/ticket.py` | Ticket DB table |
| 4 | `app/models/ticket_note.py` | Ticket notes DB table |
| 5 | `app/models/attachment.py` | File attachments DB table |
| 6 | `app/models/discussion.py` | Discussion + replies DB tables |
| 7 | `app/schemas/auth.py` | Login/Register request/response |
| 8 | `app/schemas/category.py` | Category request/response |
| 9 | `app/schemas/ticket.py` | Ticket request/response |
| 10 | `app/schemas/discussion.py` | Discussion request/response |
| 11 | `app/services/auth_service.py` | Auth business logic |
| 12 | `app/services/category_service.py` | Category CRUD logic |
| 13 | `app/services/ticket_service.py` | Ticket business logic |
| 14 | `app/services/discussion_service.py` | Discussion logic |
| 15 | `app/services/stats_service.py` | Dashboard aggregation |
| 16 | `app/api/routes/auth.py` | Auth endpoints |
| 17 | `app/api/routes/categories.py` | Category endpoints |
| 18 | `app/api/routes/tickets.py` | Ticket endpoints |
| 19 | `app/api/routes/uploads.py` | File upload endpoints |
| 20 | `app/api/routes/discussions.py` | Discussion endpoints |
| 21 | `app/api/routes/admin.py` | Admin dashboard endpoints |

### Files to MODIFY
| # | File Path | What Changes |
|---|---|---|
| 1 | `app/models/enums.py` | Add `TicketStatus`, `TicketPriority` |
| 2 | `app/models/user.py` | Add `hashed_password`, `created_at` |
| 3 | `app/models/faq.py` | Add `ForeignKey("categories.id")` |
| 4 | `app/api/deps.py` | Real JWT auth + new service injectors |
| 5 | `app/main.py` | Import all models & register all routers |

---

## Recommended Build Order

1. **Phase 1** — Fix enums & user model (10 min)
2. **Phase 2** — Real authentication (30 min)
3. **Phase 3** — Categories (15 min)
4. **Phase 4** — Tickets + Notes + Uploads (45 min) ← biggest piece
5. **Phase 5** — Discussion forum (20 min)
6. **Phase 6** — Admin dashboard stats (15 min)
7. **Phase 7** — Wire everything in main.py & test (15 min)

> [!IMPORTANT]
> After each phase, run `uvicorn app.main:app --reload` from the `backend` folder and test via the Swagger docs at `http://localhost:8000/docs`.
