# Project Context & Progress Log

## 1. Project Overview
- **Project Name:** IPB Academic Help Center (Analysis and Design System (ADS) Course Project - Semester 6)
- **Tech Stack:** FastAPI (Backend), PostgreSQL (Database/Docker Container), Vite (Frontend), Figma (UI/UX)
- **Current Architecture:** Modular structure with `app/controllers` and `app/database`.

## 2. Team & My Role
- **My Name/Role:** Cici (Lead Backend & Database Developer)
- **Context:** The Project Manager (PM) only provided the boilerplate/empty folders with `.gitkeep`. I am the sole executor responsible for building the actual backend logic and database connection.

## 3. Current Progress & State
- **Docker Setup:** PostgreSQL Docker container is successfully configured and running in the background.
- **Active Backend (Mock Mode):** `main.py` is currently running a fully functional **Mock API** (endpoints: `/`, `/health`, `/api/v1/auth/login`, and `/api/v1/auth/me`) so the frontend team is not blocked.
- **CORS:** Configured to `["*"]` to allow seamless local integration for the frontend team.
- **Backup:** The original modular router codes from the boilerplate are safely commented out at the bottom of `main.py` inside a multi-line string (`"""`).

## 4. Next Immediate Task (unless there is a better, more efficient way to handle the database connection and setup process)
- Implement the actual database connection by creating and configuring `app/database/session.py` using SQLAlchemy to connect FastAPI with the local PostgreSQL Docker container.