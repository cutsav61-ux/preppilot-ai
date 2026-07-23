# AI Interview Platform

AI-powered mock interview platform for software engineering students. Practice technical and HR interviews, get graded like a real interviewer, and track your progress before placements.

This is a monorepo with two independently deployable apps:

```
ai-interview-platform/
├── client/   Next.js 15 (App Router) frontend
├── server/   Express + TypeScript REST API
└── docs/     architecture notes, ER diagrams, API reference
```

## Status

**Phase 4 — AI Evaluation, Feedback Dashboard, History & Analytics.** Completing an interview now triggers a real AI evaluation pass (one call covering every question, via the same swappable `AI_PROVIDER`, with a transparent heuristic fallback if the AI call fails). Each answer gets a 0–100 score, an explanation, strengths/weaknesses, a suggested stronger answer, and a confidence score; the session as a whole gets an overall score, communication/technical/problem-solving ratings, a hiring recommendation, and an improvement roadmap — all shown on `/interview/[id]` once a session ends. `/history` lists every past interview with type/difficulty/status filters and reopens any of them into that same feedback view. The dashboard's score-trend and topic-performance charts are now wired to real data, and `User.stats` (avg score, streak) update with real, weighted numbers instead of placeholders.

All Phase 4 changes were additive: no existing API contract, route, or schema field was removed or restructured — only extended.

See `docs/architecture.md` for the full system design, database schema, API contract, and roadmap.

## Authentication

- **Tokens:** short-lived JWT access token (returned in the response body, kept in memory on the client) + a rotating refresh token (httpOnly, signed cookie, scoped to `/api/v1/auth`). Every refresh call rotates and re-issues both.
- **Session bootstrap:** on page load, the client silently calls `POST /auth/refresh` to re-establish the session from the refresh cookie (the access token itself doesn't survive a hard refresh, by design — it only lives in memory).
- **Protected routes:** any page under `(dashboard)/` (e.g. `/profile`) redirects to `/login` if there's no valid session, via a layout-level guard.
- **Forgot/reset password:** generates a random token, stores only its hash (`sha256`) with a 30-minute expiry, and emails a reset link. If `SMTP_HOST` isn't set in `server/.env`, the email is logged to the server console instead — handy for local development without real SMTP credentials.
- **Password changes** (via reset or the profile page) invalidate every other active session for that account.

## Getting started

### Prerequisites
- Node.js 20+
- npm 10+
- A MongoDB connection string (local or MongoDB Atlas)
- An Anthropic or OpenAI API key (needed from Phase 4 onward, not required yet)
- SMTP credentials for real password-reset emails (optional — falls back to console logging in dev)

### 1. Clone and install

```bash
cd client && npm install
cd ../server && npm install
```

### 2. Configure environment variables

```bash
cp client/.env.local.example client/.env.local
cp server/.env.example server/.env
```

Fill in the values described in each file's comments. At minimum, `server/.env` needs real values for `MONGODB_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, and `COOKIE_SECRET` for Phase 1 to work. `SMTP_*` can stay blank for local dev — reset links will just print to the server console.

### 3. Run in development

```bash
# terminal 1
cd server && npm run dev

# terminal 2
cd client && npm run dev
```

- Client: http://localhost:3000
- API: http://localhost:5000/api/v1
- API health check: http://localhost:5000/api/v1/health

### Optional: local MongoDB via Docker

```bash
docker-compose up -d
```

## Tooling

| Concern | Tool |
|---|---|
| Frontend framework | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS, Framer Motion |
| Backend framework | Express 4, TypeScript |
| Database | MongoDB + Mongoose |
| Linting/formatting | ESLint + Prettier (both apps) |

## License

Private project — all rights reserved.
