# TaskFlow — Task Management System

A full-stack task management application built with React (Vite) + Express.js + PostgreSQL.

## Live Demo

| | URL |
|---|---|
| **Frontend** | https://your-app.vercel.app *(add after deployment)* |
| **Backend API** | https://your-backend.up.railway.app/api/health *(add after deployment)* |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| Backend | Express.js, TypeScript |
| Database | PostgreSQL, Prisma ORM |
| Auth | JWT (access token in memory + refresh token in HttpOnly cookie) |
| Deployment | Vercel (frontend) + Railway (backend) + Neon (database) |

---

## Novelty Features

### 1. Project-based Kanban Boards
Tasks are organised into **Projects**. Each project has its own full Kanban board (To Do / In Progress / Done) with per-project progress tracking, task count badges, and a visual progress bar. After sign-up you land on a project overview showing all your projects at a glance.

### 2. Live Filter + Search with Priority Levels
The task board supports real-time search, status filter pills, 4-level priority filter (LOW / MEDIUM / HIGH / URGENT), and sort order — all applied simultaneously without a page reload. Tasks with past due dates are automatically highlighted in red with an "Overdue" label.

---

## Local Development Setup

### Prerequisites
- Node.js 18+
- Docker (for local PostgreSQL)

### 1. Clone and install

```bash
git clone <repo-url>
cd task-management-system

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Start the database

```bash
# From repo root
docker-compose up -d
```

### 3. Configure environment variables

```bash
# Backend — copy and fill in values
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
# VITE_API_URL defaults to http://localhost:3001/api for local dev
```

### 4. Run database migrations

```bash
cd backend
npx prisma migrate dev
```

### 5. Start both servers

```bash
# Terminal 1 — Backend (port 3001)
cd backend && npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend && npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

---

## API Documentation

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login, sets refresh cookie |
| POST | `/api/auth/refresh` | — | Refresh access token |
| POST | `/api/auth/logout` | Bearer | Clear refresh cookie |

### Projects

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/projects` | Bearer | Get all user's projects (with task counts) |
| POST | `/api/projects` | Bearer | Create a project |
| PUT | `/api/projects/:id` | Bearer | Update a project |
| DELETE | `/api/projects/:id` | Bearer | Delete a project (cascades tasks) |
| GET | `/api/projects/:id/tasks` | Bearer | Get tasks for a specific project |

### Tasks

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/tasks` | Bearer | Get all user's tasks |
| POST | `/api/tasks` | Bearer | Create a task (pass `projectId` to assign) |
| PUT | `/api/tasks/:id` | Bearer | Update a task |
| DELETE | `/api/tasks/:id` | Bearer | Delete a task |

### Task object

```json
{
  "id": "cuid",
  "title": "string",
  "description": "string | null",
  "status": "TODO | IN_PROGRESS | DONE",
  "priority": "LOW | MEDIUM | HIGH | URGENT",
  "dueDate": "ISO 8601 string | null",
  "projectId": "string | null",
  "userId": "string",
  "createdAt": "ISO 8601 string",
  "updatedAt": "ISO 8601 string"
}
```

---

## Deployment

### Database → Neon

1. Create a free PostgreSQL database at [neon.tech](https://neon.tech)
2. DATABASE_URL=postgresql://neondb_owner:npg_wsq4KkxHYFv0@ep-broad-dawn-ams8rtcb.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require

### Backend → Railway

1. Push code to GitHub
2. New Railway project → **Deploy from GitHub** → set root directory to `backend/`
3. Add environment variables (see `backend/.env.example`):
   - `DATABASE_URL` — Neon connection string
   - `JWT_SECRET` — random 32+ char string
   - `JWT_REFRESH_SECRET` — different random 32+ char string
   - `NODE_ENV=production`
   - `FRONTEND_URL` — set after Vercel deploy
4. Railway auto-runs `npm install && npm run build` then `npx prisma migrate deploy && node dist/index.js`

### Frontend → Vercel

1. Import GitHub repo → set root directory to `frontend/`
2. Add env var: `VITE_API_URL=https://your-railway-url.railway.app/api`
3. Deploy → copy the Vercel URL back to Railway's `FRONTEND_URL`

---

## Security Features

- Passwords hashed with bcrypt (cost factor 12)
- JWT access tokens expire in 15 minutes
- Refresh tokens stored in `HttpOnly`, `SameSite=Strict` cookies (7-day expiry)
- Rate limiting: 10 req/min on auth endpoints, 100 req/min on API endpoints
- Helmet.js security headers (CSP, HSTS, etc.)
- Zod input validation and sanitization on all endpoints
- Authorization: users can only access their own projects and tasks
- CORS locked to the frontend origin
- Async controller errors forwarded to Express error handler via `asyncHandler` wrapper
