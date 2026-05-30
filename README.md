# IPB Academic Help Center

Monorepo **full-stack** untuk portal bantuan akademik IPB: mahasiswa mengajukan tiket & memantau status, staff mengelola antrean, admin memantau layanan. UI dirancang mengikuti gaya dashboard kampus modern (biru IPB, kartu putih, tipografi formal).

## Struktur

- `backend/` — **FastAPI + SQLAlchemy + PostgreSQL + JWT** (arsitektur modular: routes → services → repositories → models + DTO schemas). OOP melalui kelas layanan/repositori dan *controller* tipis (`app/controllers/ticket_controller.py`).
- `frontend/` — **React + Vite + TypeScript + Tailwind + Zustand + RHF + Zod + Framer Motion + Lucide**.
- `prisma/schema.prisma` — **dokumentasi/model data** yang selaras dengan tabel PostgreSQL (ORM aktif di backend adalah **SQLAlchemy**, bukan Prisma Client).

## Prasyarat

- Node.js 20+
- Python 3.11+
- Docker (opsional, untuk PostgreSQL lokal)

## Database lokal (Docker)

```bash
docker compose up -d
```

Default koneksi: `postgresql+psycopg2://postgres:postgres@localhost:5432/ipb_help`

## Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Jalankan migrasi skema (dev): tabel dibuat otomatis saat startup aplikasi (`Base.metadata.create_all`).

Seed data demo (**menghapus seluruh tabel** lalu mengisi ulang — hanya untuk lingkungan pengembangan):

```bash
cd backend
source .venv/bin/activate
python -m app.seed
```

Akun demo (password sama: `Password123!`):

| Peran     | Email               |
|----------|---------------------|
| Mahasiswa | `quina@apps.ipb.ac.id` |
| Staff    | `staff@ipb.ac.id`   |
| Admin    | `admin@ipb.ac.id`   |

Jalankan API:

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

- Health: `GET http://127.0.0.1:8000/health`
- Dokumentasi interaktif: `http://127.0.0.1:8000/docs` (OpenAPI)
- WebSocket notifikasi (token query): `ws://127.0.0.1:8000/api/v1/ws?token=<JWT>`
- File statis hasil unggah: `http://127.0.0.1:8000/files/...`

### Variabel lingkungan backend (`backend/.env`)

| Variabel | Keterangan |
|----------|------------|
| `DATABASE_URL` | URL SQLAlchemy Postgres |
| `JWT_SECRET` | Rahasia penandatanganan JWT |
| `JWT_ALGORITHM` | Default `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Masa berlaku token |
| `CORS_ORIGINS` | Daftar origin dipisah koma (mis. `http://localhost:5173`) |
| `SMTP_*` | Opsional — jika kosong, email hanya di-log |
| `UPLOAD_DIR` | Folder penyimpanan unggahan |

### Ringkasan API (v1, prefiks `/api/v1`)

- `POST /auth/login` — body `{ email, password, role }`
- `GET /auth/me` — profil pengguna terautentikasi
- `GET/POST /categories` — daftar kategori; buat kategori (admin)
- `GET/POST /tickets` — tiket mahasiswa (JSON, lampiran lewat `attachment_urls` dari `/uploads`)
- `GET /tickets/me` — daftar tiket saya
- `GET /tickets/me/item/{public_id}` — detail tiket
- `GET/POST /tickets/me/item/{public_id}/messages` — percakapan tiket
- `GET /staff/dashboard/metrics` — ringkasan staff
- `GET/POST/PATCH /staff/tickets/...` — antrian staff
- `GET /faqs/public`, `GET /faqs/popular`, `POST /faqs/{id}/view`
- `GET/POST /discussions` + balasan + resolve (staff)
- `GET /notifications`, `POST /notifications/read-all`
- `POST /uploads` — multipart file → `{ urls: ["/files/..."] }`
- `GET /admin/analytics/summary`, `GET /admin/analytics/staff-performance`, `GET /activity/logs`
- `GET /search?q=` — pencarian FAQ + diskusi

## Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

`VITE_API_URL` dikosongkan saat development agar permintaan ke `/api` dan `/files` di-*proxy* oleh Vite ke `http://127.0.0.1:8000` (`vite.config.ts`).

Build produksi:

```bash
cd frontend
npm run build
```

### Deploy (ringkas)

- **Railway (backend)**: set `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGINS` (URL Vercel), jalankan perintah `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
- **Vercel (frontend)**: set `VITE_API_URL` ke URL publik Railway; build command `npm run build`, output `frontend/dist`.

## Fitur utama yang sudah terhubung

- JWT + peran (`mahasiswa`, `staff`, `admin`)
- Tiket layanan + percakapan + notifikasi in-app
- FAQ publik + popularitas sederhana
- Diskusi forum dasar
- Unggah file + URL lampiran pada tiket
- WebSocket *stub* untuk saluran realtime (klien dapat polling `/notifications/unread-count`)
- Mode gelap (toggle) + toast + animasi halaman ringan
- Admin analytics agregat + aktivitas log

## Catatan arsitektur

- **Backend**: pola *clean layering* — route tipis, aturan bisnis di `services/`, akses data di `repositories/`, kontrak API di `schemas/`.
- **Frontend**: komponen layout reusable (`StudentNavbar`, `StaffShell`) + utilitas Tailwind di `@layer components` (`card-surface`, `ticket-card`, `btn-primary`, …) agar kelas util tidak “berantakan” di JSX.

## Lisensi / penggunaan

Kode ini disediakan sebagai dasar produk internal kampus; sesuaikan kebijakan keamanan (migrasi DB dengan Alembic, hardening JWT, penyimpanan file ke object storage, dsb.) sebelum produksi.
# IPB Academic Help Center

Monorepo **full-stack** untuk portal bantuan akademik IPB: mahasiswa mengajukan tiket & memantau status, staff mengelola antrean, admin memantau layanan. UI dirancang mengikuti gaya dashboard kampus modern (biru IPB, kartu putih, tipografi formal).

## Struktur

- `backend/` — **FastAPI + SQLAlchemy + PostgreSQL + JWT** (arsitektur modular: routes → services → repositories → models + DTO schemas). OOP melalui kelas layanan/repositori dan *controller* tipis (`app/controllers/ticket_controller.py`).
- `frontend/` — **React + Vite + TypeScript + Tailwind + Zustand + RHF + Zod + Framer Motion + Lucide**.
- `prisma/schema.prisma` — **dokumentasi/model data** yang selaras dengan tabel PostgreSQL (ORM aktif di backend adalah **SQLAlchemy**, bukan Prisma Client).

## Prasyarat

- Node.js 20+
- Python 3.11+
- Docker (opsional, untuk PostgreSQL lokal)

## Database lokal (Docker)

```bash
docker compose up -d
```

Default koneksi: `postgresql+psycopg2://postgres:postgres@localhost:5432/ipb_help`

## Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Jalankan migrasi skema (dev): tabel dibuat otomatis saat startup aplikasi (`Base.metadata.create_all`).

Seed data demo (**menghapus seluruh tabel** lalu mengisi ulang — hanya untuk lingkungan pengembangan):

```bash
cd backend
source .venv/bin/activate
python -m app.seed
```

Akun demo (password sama: `Password123!`):

| Peran     | Email               |
|----------|---------------------|
| Mahasiswa | `quina@apps.ipb.ac.id` |
| Staff    | `staff@ipb.ac.id`   |
| Admin    | `admin@ipb.ac.id`   |

Jalankan API:

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

- Health: `GET http://127.0.0.1:8000/health`
- Dokumentasi interaktif: `http://127.0.0.1:8000/docs` (OpenAPI)
- WebSocket notifikasi (token query): `ws://127.0.0.1:8000/api/v1/ws?token=<JWT>`
- File statis hasil unggah: `http://127.0.0.1:8000/files/...`

### Variabel lingkungan backend (`backend/.env`)

| Variabel | Keterangan |
|----------|------------|
| `DATABASE_URL` | URL SQLAlchemy Postgres |
| `JWT_SECRET` | Rahasia penandatanganan JWT |
| `JWT_ALGORITHM` | Default `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Masa berlaku token |
| `CORS_ORIGINS` | Daftar origin dipisah koma (mis. `http://localhost:5173`) |
| `SMTP_*` | Opsional — jika kosong, email hanya di-log |
| `UPLOAD_DIR` | Folder penyimpanan unggahan |

### Ringkasan API (v1, prefiks `/api/v1`)

- `POST /auth/login` — body `{ email, password, role }`
- `GET /auth/me` — profil pengguna terautentikasi
- `GET/POST /categories` — daftar kategori; buat kategori (admin)
- `GET/POST /tickets` — tiket mahasiswa (JSON, lampiran lewat `attachment_urls` dari `/uploads`)
- `GET /tickets/me` — daftar tiket saya
- `GET /tickets/me/item/{public_id}` — detail tiket
- `GET/POST /tickets/me/item/{public_id}/messages` — percakapan tiket
- `GET /staff/dashboard/metrics` — ringkasan staff
- `GET/POST/PATCH /staff/tickets/...` — antrian staff
- `GET /faqs/public`, `GET /faqs/popular`, `POST /faqs/{id}/view`
- `GET/POST /discussions` + balasan + resolve (staff)
- `GET /notifications`, `POST /notifications/read-all`
- `POST /uploads` — multipart file → `{ urls: ["/files/..."] }`
- `GET /admin/analytics/summary`, `GET /admin/analytics/staff-performance`, `GET /activity/logs`
- `GET /search?q=` — pencarian FAQ + diskusi

## Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

`VITE_API_URL` dikosongkan saat development agar permintaan ke `/api` dan `/files` di-*proxy* oleh Vite ke `http://127.0.0.1:8000` (`vite.config.ts`).

Build produksi:

```bash
cd frontend
npm run build
```

### Deploy (ringkas)

- **Railway (backend)**: set `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGINS` (URL Vercel), jalankan perintah `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
- **Vercel (frontend)**: set `VITE_API_URL` ke URL publik Railway; build command `npm run build`, output `frontend/dist`.

## Fitur utama yang sudah terhubung

- JWT + peran (`mahasiswa`, `staff`, `admin`)
- Tiket layanan + percakapan + notifikasi in-app
- FAQ publik + popularitas sederhana
- Diskusi forum dasar
- Unggah file + URL lampiran pada tiket
- WebSocket *stub* untuk saluran realtime (klien dapat polling `/notifications/unread-count`)
- Mode gelap (toggle) + toast + animasi halaman ringan
- Admin analytics agregat + aktivitas log

## Catatan arsitektur

- **Backend**: pola *clean layering* — route tipis, aturan bisnis di `services/`, akses data di `repositories/`, kontrak API di `schemas/`.
- **Frontend**: komponen layout reusable (`StudentNavbar`, `StaffShell`) + utilitas Tailwind di `@layer components` (`card-surface`, `ticket-card`, `btn-primary`, …) agar kelas util tidak “berantakan” di JSX.

## Lisensi / penggunaan

Kode ini disediakan sebagai dasar produk internal kampus; sesuaikan kebijakan keamanan (migrasi DB dengan Alembic, hardening JWT, penyimpanan file ke object storage, dsb.) sebelum produksi.
