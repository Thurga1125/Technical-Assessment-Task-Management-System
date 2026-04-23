# TaskFlow — Task Management System

A full-stack task management application built with React (Vite) + Express.js + PostgreSQL.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| Backend | Express.js, TypeScript |
| Database | PostgreSQL, Prisma ORM |
| Auth | JWT (access token in memory + refresh token in HttpOnly cookie) |
| Deployment | Vercel (frontend) + Railway (backend) + Neon (database) |

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
# Backend
cp .env.example backend/.env
# Edit backend/.env — the defaults work with docker-compose

# Frontend
cp .env.example frontend/.env
# Edit frontend/.env — VITE_API_URL=http://localhost:3001/api
```

### 4. Run database migrations

```bash
cd backend
npx prisma migrate dev --name init
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

### Tasks

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/tasks` | Bearer | Get all user's tasks |
| POST | `/api/tasks` | Bearer | Create a task |
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
  "userId": "string",
  "createdAt": "ISO 8601 string",
  "updatedAt": "ISO 8601 string"
}
```

---

## Deployment

### Frontend → Vercel

1. Import the `frontend/` folder to Vercel
2. Set `VITE_API_URL=https://your-backend.railway.app/api`
3. Deploy

### Backend → Railway

1. Create a new Railway project, connect the `backend/` folder
2. Add environment variables from `.env.example`
3. Set `DATABASE_URL` to your Neon connection string
4. Run `npx prisma migrate deploy` as a build command

### Database → Neon

1. Create a free PostgreSQL database at [neon.tech](https://neon.tech)
2. Copy the connection string to `DATABASE_URL`

---

## Security Features

- Passwords hashed with bcrypt (cost factor 12)
- JWT access tokens expire in 15 minutes
- Refresh tokens stored in `HttpOnly`, `SameSite=Strict` cookies (7-day expiry)
- Rate limiting on auth endpoints (10 req/min per IP)
- Helmet.js security headers (CSP, HSTS, etc.)
- Zod input validation and sanitization on all endpoints
- Authorization: users can only access their own tasks
- CORS locked to the frontend origin

## Novelty Feature: Task Priority + Due Dates

Tasks support 4 priority levels (LOW / MEDIUM / HIGH / URGENT) with color-coded badges. Due dates can be set on any task, and the dashboard automatically highlights overdue tasks in red.
