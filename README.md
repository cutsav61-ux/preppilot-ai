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

**v1.0 hardening pass.** The AI evaluation fallback now chains Anthropic → Gemini → a static bank (only reachable if both real providers fail), instead of going straight to static scores. Evaluations gained more depth: per-question mistakes, missed concepts, follow-up questions, and a difficulty estimate; overall feedback gained answer quality, a study plan, and company readiness. The Settings page is now fully real — theme, notification/default preferences, active-session management (view/revoke), data export, and password-confirmed account deletion — where previously only the topbar theme toggle worked. Analytics gained weekly trend, completion rate, and difficulty distribution, and every ratio is now computed with explicit zero-guards so the API can never return `NaN`. Dashboard charts are now lazy-loaded (measured ~40% smaller initial JS on `/dashboard`). Free-text fields are sanitized server-side as defense-in-depth. See `docs/API.md` and `docs/DEPLOYMENT.md` for the full reference.

**Prior phases (1–5)** covered authentication, the dashboard, the AI interview engine (question generation with the same provider-fallback design), AI evaluation, interview history, and analytics/reporting — all still intact and unchanged except where noted above.

**Voice interview mode.** The live interview screen now has a Text/Voice toggle (client-side only, nothing persisted to the database). Voice mode uses the browser's native SpeechRecognition API (Chrome/Chromium only — the toggle is disabled with an explanation on unsupported browsers) for live, editable transcription, and SpeechSynthesis to read each question aloud with replay/mute controls. A 120-second per-question countdown auto-advances; a Skip button clears the draft and moves on without saving. Backend, database schema, routes, and text mode are entirely unchanged — the answer-submission logic is shared identically between both modes.

All Phase 5 changes were additive: no existing API, route, or schema field was removed — only extended (new optional fields, new endpoints, new query params with safe defaults).

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
- An Anthropic or Google Gemini API key (needed from Phase 4 onward, not required yet)
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
| AI | Anthropic Claude (primary) with automatic Google Gemini fallback, then a static question/scoring bank if both fail |
| Linting/formatting | ESLint + Prettier (both apps) |
| Security | Helmet, rate limiting, JWT rotation, signed httpOnly cookies, input sanitization |

## Further documentation

- [`docs/architecture.md`](docs/architecture.md) — system design, database schema, API contract, original roadmap
- [`docs/API.md`](docs/API.md) — full REST API reference
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — deployment checklist for Vercel (client) + Render (server) + MongoDB Atlas

## License

Private project — all rights reserved.
