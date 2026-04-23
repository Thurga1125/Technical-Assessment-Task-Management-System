# Task Management System — Architecture Plan

## Backend Choice: Express.js

Chosen for its explicit control over middleware, lightweight footprint, and widespread adoption. Express gives us the freedom to layer security primitives (helmet, CORS, rate limiting) precisely where they're needed. An alternative would be **Next.js API Routes**, which would collapse frontend and backend into one deployment (simpler Vercel setup), but a separate backend better demonstrates clean separation of concerns and is more representative of real-world production systems. **NestJS** would add enterprise-grade structure (dependency injection, decorators), but its overhead is unjustified for a project of this scope.

## Architecture Overview

```
┌─────────────────────┐     HTTPS / REST      ┌──────────────────────────┐
│  React SPA (Vite)   │  ──────────────────>  │  Express.js API          │
│  Vercel             │  <──────────────────  │  Railway / Render        │
└─────────────────────┘                       └──────────┬───────────────┘
                                                         │ Prisma ORM
                                              ┌──────────▼───────────────┐
                                              │  PostgreSQL (Neon)        │
                                              └──────────────────────────┘
```

**Layers:**
- **Frontend** — React 18 + Vite + TypeScript + Tailwind CSS, deployed to Vercel
- **Backend** — Express.js + TypeScript, deployed to Railway
- **Database** — PostgreSQL via Prisma ORM, hosted on Neon (free tier)
- **Auth** — JWT access token (15 min, stored in memory) + refresh token (7 days, HttpOnly cookie)

## Security Considerations

| Threat | Mitigation |
|---|---|
| XSS | React escapes output by default; no `dangerouslySetInnerHTML`; CSP headers via `helmet.js` |
| CSRF | Refresh token in `HttpOnly SameSite=Strict` cookie; access token never in `localStorage` |
| Brute force | `express-rate-limit` on `/api/auth/*` — 10 attempts/min per IP |
| SQL injection | Prisma parameterised queries — safe by default |
| Password theft | `bcrypt` with cost factor 12 |
| Stack trace leaks | Global error handler returns generic messages; full errors logged server-side only |
| JWT tampering | HS256 signing with env-only secrets; short access token expiry |
| Mass assignment | Zod strips unknown fields on every `POST`/`PUT` |
| Insecure transport | CORS locked to known frontend origin; `helmet` adds HSTS + security headers |

## Better Tech Choices (if applicable)

- **tRPC** over REST would give end-to-end type safety without code generation
- **Next.js full-stack** (API routes) would eliminate the need for two separate deployments
- **Redis** could back the rate limiter for distributed deployments (current in-memory limiter resets on restart)
- **Refresh token rotation** with a blocklist (Redis) would prevent token replay after logout
