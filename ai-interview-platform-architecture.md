# AI Interview Platform — Architecture & Planning Document

> Status: **Planning phase — no code generated yet.** This document covers system architecture, folder structure, database schema, API design, component/page hierarchy, and the development roadmap. Once approved, implementation begins phase by phase.

---

## 1. System Architecture Overview

### 1.1 Style
A decoupled **3-tier architecture**:
- **Client tier** — Next.js 15 (App Router), deployed independently on Vercel.
- **API tier** — Node.js/Express REST API following clean architecture (controllers → services → models), deployed on Render/Railway.
- **Data tier** — MongoDB Atlas, accessed via Mongoose.
- **AI tier** — an internal abstraction layer inside the API that talks to an LLM provider (Anthropic Claude or OpenAI), never called directly from the client.

```text
┌────────────────────┐        HTTPS/JSON         ┌──────────────────────────┐
│   Next.js Client    │ ─────────────────────────▶│      Express API         │
│  (Vercel, SSR/CSR)  │◀───────────────────────── │   (Render/Railway)       │
└────────────────────┘        access token         └──────────┬───────────────┘
        ▲   cookie: refresh token                              │
        │                                                       ▼
        │                                          ┌──────────────────────────┐
        │                                          │  Service Layer            │
        │                                          │  (auth, user, interview,  │
        │                                          │   analytics, AI service)  │
        │                                          └──────┬───────────┬───────┘
        │                                                 ▼           ▼
        │                                    ┌──────────────────┐  ┌────────────────────┐
        │                                    │  MongoDB Atlas    │  │  LLM Provider API   │
        │                                    │  (Mongoose ODM)   │  │  (Claude / OpenAI)   │
        │                                    └──────────────────┘  └────────────────────┘
```

### 1.2 Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | Next.js 15 (App Router, Server + Client Components) |
| Language | TypeScript (strict mode, both apps) |
| Styling | Tailwind CSS + `clsx` / `tailwind-merge` |
| Animation | Framer Motion |
| Forms & validation | React Hook Form + Zod |
| Server-state cache | TanStack Query |
| Client/UI state | Zustand (auth session, theme, active interview session) |
| Charts | Recharts |
| Toasts | Sonner |
| Icons | lucide-react |
| Backend framework | Node.js + Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Auth | JWT (short-lived access + rotating refresh token) + bcrypt |
| Validation (API) | Zod |
| AI provider | Anthropic Claude API (primary) — abstracted so OpenAI can be swapped in |
| API docs | OpenAPI 3.0 (Swagger UI) + Postman collection |
| Logging | Pino |
| Testing | Vitest + React Testing Library (frontend), Jest + Supertest (backend) |
| Deployment | Vercel (client), Render/Railway (server), MongoDB Atlas (db) |

### 1.3 Authentication Flow
1. Signup → password hashed with bcrypt → user document created.
2. Login → credentials verified → **access token** (JWT, ~15 min) returned in response body, **refresh token** (JWT, ~30 days) set as an httpOnly, secure cookie and its hash stored in the `refreshtokens` collection.
3. Client keeps the access token in memory (Zustand), attaches it as `Authorization: Bearer`.
4. On 401, client silently calls `/auth/refresh`; server validates the cookie against the stored hash, rotates both tokens.
5. Logout invalidates the stored refresh token and clears the cookie.
6. All protected routes go through an `auth.middleware.ts` that verifies the access token and attaches `req.user`.

### 1.4 AI Integration Approach
The AI logic is isolated behind an `AIService` interface so the provider can be swapped without touching controllers:

- `generateQuestions({ type, difficulty, topic, count })` → returns structured question objects.
- `evaluateAnswer({ question, answer, difficulty })` → returns a score + strengths/weaknesses/suggestions.
- `generateOverallFeedback(interview)` → returns a session-level summary once all questions are answered.

Design notes:
- Prompts live in versioned template files, not inline strings.
- Every AI response is validated against a Zod schema before being trusted/saved (protects against malformed model output).
- Retry with exponential backoff + timeout; a small fallback question bank is used if the AI call fails outright, so a demo never breaks.
- Per-user daily request limits to control cost and abuse.

### 1.5 Non-Functional Considerations
- **Scalability:** stateless API (JWT, no server-side sessions) → horizontally scalable; MongoDB indexes on hot query paths.
- **Security:** bcrypt password hashing, JWT rotation, helmet, CORS allow-list, rate limiting, input validation on every mutating route, no secrets in client code.
- **Observability:** structured logging (Pino), request IDs, centralized error handler with consistent error shape.
- **Resilience:** AI fallback bank, graceful degradation if the LLM provider is down.

---

## 2. Repository & Folder Structure

Single monorepo, two independently deployable apps.

```text
ai-interview-platform/
├── client/                     # Next.js 15 app
├── server/                     # Express API
├── docs/                       # architecture notes, ER diagram, API reference export
├── .gitignore
├── README.md
└── docker-compose.yml          # local Mongo + server, optional
```

### 2.1 `client/` — Next.js 15

```text
client/
├── public/
│   ├── icons/
│   └── images/
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx                       # landing page
│   │   ├── (auth)/
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx                     # sidebar + navbar shell, protected
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   ├── history/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   └── interview/
│   │   │       ├── new/page.tsx                # setup wizard
│   │   │       ├── [id]/page.tsx                # live session
│   │   │       └── [id]/results/page.tsx
│   │   ├── layout.tsx                          # root layout, providers
│   │   ├── globals.css
│   │   ├── not-found.tsx
│   │   └── error.tsx
│   ├── components/
│   │   ├── ui/            # Button, Input, Card, Modal, Badge, Avatar, Skeleton, Tabs, Dropdown, ProgressBar, Spinner
│   │   ├── layout/         # Navbar, Footer, Sidebar, DashboardShell, ThemeToggle
│   │   ├── landing/         # Hero, FeatureGrid, HowItWorks, Testimonials, CTA, FAQ
│   │   ├── auth/            # LoginForm, SignupForm, AuthCard, PasswordInput
│   │   ├── dashboard/       # StatsGrid, RecentInterviews, QuickStartCard, StreakWidget
│   │   ├── interview/       # SetupWizard, QuestionCard, AnswerEditor, InterviewTimer, ProgressStepper, LiveFeedbackChip
│   │   ├── results/         # ScoreSummary, PerQuestionFeedback, StrengthsWeaknesses, SuggestionsList
│   │   ├── history/         # HistoryTable, HistoryFilters, HistoryCard
│   │   ├── profile/         # ProfileHeader, ProfileForm, AvatarUpload
│   │   ├── settings/        # ThemeSettings, NotificationSettings, SecuritySettings, DangerZone
│   │   └── charts/          # ScoreTrendChart, CategoryRadarChart, SkillBarChart
│   ├── lib/                 # apiClient, constants, zod schemas, queryClient
│   ├── hooks/                # useAuth, useInterview, useTheme, useDebounce
│   ├── store/                 # authStore, themeStore, interviewSessionStore (zustand)
│   ├── types/                  # shared TS interfaces (mirrors API contracts)
│   └── providers/               # ThemeProvider, QueryProvider, ToastProvider, AuthProvider
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── .env.local.example
└── package.json
```

### 2.2 `server/` — Express API (clean architecture)

```text
server/
├── src/
│   ├── config/            # env.ts, db.ts, constants.ts
│   ├── models/            # User.model.ts, Interview.model.ts, RefreshToken.model.ts
│   ├── controllers/       # auth, user, interview, analytics controllers (thin, HTTP-only)
│   ├── services/          # business logic — auth, user, interview, analytics
│   │   └── ai/
│   │       ├── ai.service.ts          # provider-agnostic interface
│   │       ├── providers/
│   │       │   ├── anthropic.provider.ts
│   │       │   └── openai.provider.ts
│   │       └── prompts/               # versioned prompt templates
│   ├── routes/             # auth.routes.ts, user.routes.ts, interview.routes.ts, analytics.routes.ts, index.ts
│   ├── middlewares/        # auth, error, rateLimiter, validate, notFound
│   ├── validators/          # zod schemas per resource
│   ├── utils/                # jwt, bcrypt, apiResponse, logger, asyncHandler
│   ├── types/                  # express.d.ts (req.user), domain types
│   ├── docs/                    # swagger.ts, openapi.yaml
│   ├── app.ts                    # express app + middleware wiring
│   └── server.ts                  # entrypoint, DB connect, listen
├── tests/
│   ├── unit/
│   └── integration/
├── .env.example
├── tsconfig.json
└── package.json
```

---

## 3. Database Schema (MongoDB / Mongoose)

### 3.1 Entity Overview

```text
User (1) ────< (many) Interview
User (1) ────< (many) RefreshToken
Interview (1) ──contains──> Question[] (embedded subdocuments)
```

Questions are **embedded** inside `Interview` (not a separate collection) because an interview session is always read/written as a whole unit — no independent queries are ever made against a single question.

### 3.2 `User`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | auto |
| `name` | String | required |
| `email` | String | required, unique, lowercase, indexed |
| `password` | String | required, bcrypt-hashed, `select: false` |
| `avatarUrl` | String | optional |
| `role` | String enum `[student, admin]` | default `student` |
| `targetRole` | String | e.g. "Frontend Developer" — used to personalize AI prompts |
| `experienceLevel` | String enum `[beginner, intermediate, advanced]` | default `beginner` |
| `bio` | String | optional |
| `settings.theme` | String enum `[light, dark, system]` | default `system` |
| `settings.emailNotifications` | Boolean | default `true` |
| `settings.defaultInterviewType` | String enum `[technical, hr]` | optional |
| `settings.defaultDifficulty` | String enum `[easy, medium, hard]` | optional |
| `stats.totalInterviews` | Number | denormalized, updated on completion |
| `stats.avgScore` | Number | denormalized |
| `stats.currentStreak` | Number | denormalized |
| `stats.lastInterviewAt` | Date | denormalized |
| `isEmailVerified` | Boolean | default `false` (stretch goal) |
| `createdAt` / `updatedAt` | Date | timestamps |

### 3.3 `Interview`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | auto |
| `userId` | ObjectId → `User` | required, indexed |
| `type` | String enum `[technical, hr]` | required |
| `topic` | String | e.g. "DSA – Arrays", "System Design", "Behavioral" |
| `difficulty` | String enum `[easy, medium, hard]` | required |
| `status` | String enum `[in_progress, completed, abandoned]` | default `in_progress` |
| `questions` | Array<Question subdocument> | see below |
| `overallFeedback.overallScore` | Number (0–100) | set on completion |
| `overallFeedback.communicationScore` | Number | set on completion |
| `overallFeedback.technicalScore` | Number | set on completion |
| `overallFeedback.summary` | String | AI-generated narrative |
| `overallFeedback.topStrengths` | String[] | |
| `overallFeedback.topImprovements` | String[] | |
| `overallFeedback.recommendedTopics` | String[] | for "what to study next" |
| `startedAt` | Date | |
| `completedAt` | Date | |
| `durationSeconds` | Number | |
| `createdAt` / `updatedAt` | Date | timestamps |

**`Question` subdocument**

| Field | Type | Notes |
|---|---|---|
| `order` | Number | position in the interview |
| `questionText` | String | AI-generated |
| `category` | String | e.g. "Arrays", "Behavioral – Conflict" |
| `userAnswer` | String | submitted by candidate |
| `answeredAt` | Date | |
| `timeTakenSeconds` | Number | |
| `evaluation.score` | Number (0–100) | |
| `evaluation.strengths` | String[] | |
| `evaluation.weaknesses` | String[] | |
| `evaluation.suggestions` | String[] | |
| `evaluation.idealAnswerSummary` | String | brief model-answer outline |

### 3.4 `RefreshToken`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | auto |
| `userId` | ObjectId → `User` | indexed |
| `tokenHash` | String | hashed refresh token, never stored plaintext |
| `deviceInfo` | String | user-agent, optional |
| `expiresAt` | Date | TTL-indexed for auto-cleanup |
| `createdAt` | Date | |

### 3.5 Recommended Indexes
- `User.email` — unique
- `Interview.userId + createdAt` — compound, for paginated history sorted by recency
- `Interview.userId + status`
- `RefreshToken.tokenHash` — unique
- `RefreshToken.expiresAt` — TTL index (auto-expire documents)

---

## 4. API Endpoints (REST, versioned under `/api/v1`)

Standard response envelope: `{ success, data?, message?, error? }`. List endpoints include `meta: { page, limit, total, totalPages }`.

### 4.1 Auth — `/api/v1/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/signup` | Public | Create account |
| POST | `/login` | Public | Authenticate, returns access token + sets refresh cookie |
| POST | `/refresh` | Refresh cookie | Rotate access + refresh tokens |
| POST | `/logout` | Protected | Invalidate refresh token, clear cookie |
| GET | `/me` | Protected | Return current authenticated user |

### 4.2 Users — `/api/v1/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/profile` | Protected | Get profile |
| PUT | `/profile` | Protected | Update name / bio / targetRole / experienceLevel / avatar |
| PUT | `/password` | Protected | Change password |
| PUT | `/settings` | Protected | Update theme / notifications / defaults |
| DELETE | `/account` | Protected | Delete account and associated data |

### 4.3 Interviews — `/api/v1/interviews`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | Protected | Generate a new interview (`type`, `difficulty`, `topic`, `numQuestions`) — calls AI service |
| GET | `/` | Protected | List interview history — paginated, filterable by `type`, `difficulty`, `status`, date range |
| GET | `/:id` | Protected | Get a single interview with all questions/answers |
| POST | `/:id/answers` | Protected | Submit an answer for one question — triggers AI evaluation for that question |
| POST | `/:id/complete` | Protected | Finalize interview — triggers AI overall feedback, updates `User.stats` |
| PATCH | `/:id/abandon` | Protected | Mark as abandoned if the user exits early |
| DELETE | `/:id` | Protected | Delete an interview record |

### 4.4 Analytics — `/api/v1/analytics`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/overview` | Protected | Total interviews, average score, streak, last activity |
| GET | `/score-trend` | Protected | Time-series score data (`?range=30d\|90d\|all`) for line chart |
| GET | `/category-breakdown` | Protected | Average score per category/topic, for radar/bar chart |

### 4.5 Misc

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/health` | Public | Uptime/health check |
| GET | `/api/v1/docs` | Public | Swagger UI (OpenAPI spec) |

---

## 5. Frontend Component Hierarchy

```text
RootLayout
├── ThemeProvider
├── QueryProvider
├── ToastProvider (Sonner)
└── AuthProvider
    │
    ├── (marketing) Landing Page
    │   ├── Navbar
    │   ├── Hero
    │   ├── FeatureGrid
    │   ├── HowItWorks
    │   ├── Testimonials
    │   ├── CTASection
    │   ├── FAQSection
    │   └── Footer
    │
    ├── (auth) Login / Signup
    │   └── AuthCard
    │       ├── LoginForm | SignupForm
    │       └── PasswordInput
    │
    └── (dashboard) DashboardShell        # protected, requires auth
        ├── Sidebar
        ├── Navbar (with ThemeToggle, Avatar menu)
        │
        ├── Dashboard Page
        │   ├── StatsGrid (StatCard × N)
        │   ├── ScoreTrendChart
        │   ├── QuickStartCard          # "Start new interview" CTA
        │   ├── RecentInterviewsList (InterviewCard × N)
        │   └── StreakWidget
        │
        ├── Interview Setup Page
        │   └── SetupWizard
        │       ├── TypeSelector (technical/HR)
        │       ├── DifficultySelector
        │       ├── TopicSelector
        │       └── StartButton
        │
        ├── Live Interview Page
        │   ├── ProgressStepper
        │   ├── InterviewTimer
        │   ├── QuestionCard
        │   ├── AnswerEditor
        │   ├── LiveFeedbackChip
        │   └── NavigationControls (Next / Submit)
        │
        ├── Results Page
        │   ├── ScoreSummaryCard
        │   ├── CategoryRadarChart
        │   ├── PerQuestionFeedbackAccordion (FeedbackItem × N)
        │   ├── StrengthsWeaknessesList
        │   ├── SuggestionsList
        │   └── ShareResultButton
        │
        ├── History Page
        │   ├── HistoryFilters
        │   ├── HistoryTable / HistoryCard grid
        │   └── (row click) → Results Page (reused)
        │
        ├── Profile Page
        │   ├── ProfileHeader (AvatarUpload)
        │   └── ProfileForm
        │
        └── Settings Page
            ├── ThemeSettings
            ├── NotificationSettings
            ├── SecuritySettings (change password)
            └── DangerZone (delete account)
```

Shared `ui/` primitives (Button, Input, Select, Card, Modal, Badge, Avatar, Skeleton, Tabs, Dropdown, ProgressBar, Spinner) are consumed throughout the tree above rather than re-listed per page.

---

## 6. Page Hierarchy / Routing Map

```text
/                                   → Landing page               (public)
/login                              → Login                       (public, redirects if authed)
/signup                             → Signup                      (public, redirects if authed)
/dashboard                          → Dashboard home               (protected)
/profile                            → User profile                 (protected)
/settings                           → Settings                     (protected)
/history                            → Interview history list        (protected)
/history/[id]                       → Past interview detail (reuses Results) (protected)
/interview/new                      → Interview setup wizard         (protected)
/interview/[id]                     → Live interview session          (protected)
/interview/[id]/results             → Results & AI feedback           (protected)
```

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Marketing/landing page, drives signup |
| `/login`, `/signup` | Public | Auth entry points |
| `/dashboard` | Protected | Overview: stats, quick start, recent activity |
| `/interview/new` | Protected | Configure and generate a new AI interview |
| `/interview/[id]` | Protected | Answer questions one at a time, live timer |
| `/interview/[id]/results` | Protected | AI-scored breakdown for that session |
| `/history` | Protected | All past sessions, filterable |
| `/history/[id]` | Protected | Read-only view of a completed session |
| `/profile` | Protected | Edit personal info |
| `/settings` | Protected | Theme, notifications, security |

Route protection is enforced via a layout-level check in `(dashboard)/layout.tsx` (redirects unauthenticated users to `/login`), backed by the `authStore` + a `useAuth` hook that validates the session on load.

---

## 7. Development Roadmap

| Phase | Duration | Deliverables |
|---|---|---|
| **0. Foundations** | 2–3 days | Repo scaffolding, Next.js + TS + Tailwind init, Express + TS init, MongoDB Atlas setup, env config, ESLint/Prettier/Husky, base folder structure |
| **1. Auth System** | 4–5 days | `User` model, signup/login/refresh/logout APIs, bcrypt + JWT, auth middleware, login/signup pages & forms, `authStore`, protected-route layout |
| **2. Landing Page & Design System** | 4–5 days | UI primitives, theme provider (dark/light), landing sections, Framer Motion animation pass, full responsiveness |
| **3. Dashboard Shell & Profile** | 3–4 days | Sidebar/navbar shell, profile page + edit form, avatar upload, settings page skeleton, loading skeletons |
| **4. AI Interview Generator** | 5–7 days | `AIService` abstraction, question-generation prompts, setup wizard UI, `POST /interviews`, end-to-end interview creation |
| **5. Live Interview Flow & Evaluation** | 6–8 days | Question-by-question UI, answer submission, per-answer AI evaluation, timer/progress stepper, `POST /:id/answers` & `/:id/complete`, overall feedback generation |
| **6. Results, History & Progress Charts** | 5–6 days | Results page, history list/filters/detail, analytics endpoints, Recharts trend/radar/bar charts, dashboard stats wired to real data |
| **7. Settings, Polish & Edge Cases** | 3–4 days | Theme persistence, notification/security settings, error boundaries, empty states, full skeleton/toast coverage, accessibility & responsive QA |
| **8. Testing, Docs & Deployment** | 4–5 days | Unit/integration tests, OpenAPI/Swagger docs, Postman collection, README, deploy client (Vercel) + server (Render/Railway) + Atlas, CI/CD via GitHub Actions |

**Estimated total:** ~5–6 weeks solo / part-time; compresses with a small team working phases in parallel (frontend UI vs. backend/AI).

### Stretch Goals (v2, post-MVP — good "future work" talking points for interviews)
- Voice-based interviews (speech-to-text answer capture)
- Video recording with basic delivery/confidence analysis
- Resume parsing to auto-personalize question topics
- Company-specific question banks
- Peer/mentor review of answers
- Leaderboard / gamification
- Admin analytics dashboard
- Multi-language support

---

## 8. Environment Variables Reference

### `server/.env`
| Variable | Purpose |
|---|---|
| `PORT` | API port |
| `NODE_ENV` | `development` / `production` |
| `MONGODB_URI` | Atlas connection string |
| `JWT_ACCESS_SECRET` / `JWT_ACCESS_EXPIRY` | Access token signing |
| `JWT_REFRESH_SECRET` / `JWT_REFRESH_EXPIRY` | Refresh token signing |
| `AI_PROVIDER` | `anthropic` \| `openai` |
| `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` | LLM provider credentials |
| `CLIENT_URL` | CORS allow-list |
| `COOKIE_SECRET` | Signs the refresh-token cookie |
| `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX` | Rate limiting config |

### `client/.env.local`
| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Points client to the Express API |
| `NEXT_PUBLIC_APP_NAME` | Branding |

---

## 9. Deployment Plan
- **Frontend:** Vercel — auto-deploy from `main`, preview deploys per PR.
- **Backend:** Render or Railway — auto-deploy from `main`, health check on `/api/v1/health`.
- **Database:** MongoDB Atlas free/shared tier, IP allow-list + connection string in secrets.
- **CI/CD:** GitHub Actions — lint + typecheck + test on every PR, deploy on merge to `main`.
- **API Docs:** Swagger UI served at `/api/v1/docs`, plus an exported Postman collection in `docs/`.

---

**Next step:** review this document and confirm the folder structure, schema, and phase order. Once approved, I'll begin with **Phase 0 (Foundations)** and generate code phase by phase, in order — nothing gets written before you say go.
