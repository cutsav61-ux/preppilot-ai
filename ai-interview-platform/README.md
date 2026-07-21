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

**Phase 0 — Foundations.** Project scaffolding, tooling, design system, landing page, and auth layout are in place. Auth logic, AI integration, and the interview flow land in later phases.

See `docs/architecture.md` for the full system design, database schema, API contract, and roadmap.

## Getting started

### Prerequisites
- Node.js 20+
- npm 10+
- A MongoDB connection string (local or MongoDB Atlas)
- An Anthropic or OpenAI API key (needed from Phase 4 onward, not required yet)

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

Fill in the values described in each file's comments.

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
