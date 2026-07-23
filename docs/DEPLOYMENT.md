# Deployment Checklist

This app deploys as two independent services plus a managed database. Nothing here requires code changes — it's configuration and environment setup.

## 1. MongoDB Atlas
- [ ] Create a free/shared cluster
- [ ] Create a database user (not the Atlas account itself)
- [ ] Network access: allow your Render service's IP, or `0.0.0.0/0` for simplicity (tighten later)
- [ ] Copy the connection string → this becomes `MONGODB_URI`

## 2. Backend → Render
- [ ] New Web Service, root directory `server/`
- [ ] Build command: `npm install && npm run build`
- [ ] Start command: `npm start`
- [ ] Health check path: `/api/v1/health`
- [ ] Environment variables (see `server/.env.example` for the full list):
  - `NODE_ENV=production`
  - `MONGODB_URI` (from step 1)
  - `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `COOKIE_SECRET` — generate with `openssl rand -hex 32`, each **must be unique**
  - `CLIENT_URL` — your Vercel domain (e.g. `https://your-app.vercel.app`), used for CORS and the password-reset email link
  - `AI_PROVIDER=anthropic`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY` (Gemini is optional but recommended as the automatic fallback)
  - `SMTP_*` — real credentials if you want password-reset emails to actually send; otherwise they're logged, not sent
- [ ] Confirm `/api/v1/health` returns 200 after deploy

## 3. Frontend → Vercel
- [ ] Import the repo, root directory `client/`
- [ ] Framework preset: Next.js (auto-detected)
- [ ] Environment variables:
  - `NEXT_PUBLIC_API_BASE_URL` — your Render URL + `/api/v1`
  - `NEXT_PUBLIC_APP_NAME` (optional)
- [ ] Deploy, then confirm the landing page loads and `/login` reaches the API (check the network tab for the `/auth/refresh` call on load)

## 4. Cross-service checks
- [ ] CORS: `CLIENT_URL` on the server exactly matches the deployed Vercel URL (including `https://`, no trailing slash)
- [ ] Cookies: refresh-token cookie is `secure` in production — this requires the client to actually be served over HTTPS (Vercel does this by default)
- [ ] Rate limits (`RATE_LIMIT_WINDOW_MS`/`RATE_LIMIT_MAX`) are sane for expected traffic
- [ ] Rotate any secrets that were ever committed to git history, even accidentally

## 5. Post-deploy smoke test
- [ ] Sign up a test account
- [ ] Start and complete a short interview
- [ ] Confirm AI evaluation returns real scores (not the "AI evaluation unavailable" fallback copy) — if you see fallback scores, check `ANTHROPIC_API_KEY`/`GEMINI_API_KEY` and the Render logs for the provider warning
- [ ] Download the PDF report
- [ ] Check the Settings page: change password, export data, view sessions

## Not included here
Actually provisioning Render/Vercel/Atlas accounts, DNS, and CI/CD pipelines requires access to your accounts and can't be done for you — this checklist is what to do once you have that access. A minimal GitHub Actions workflow (lint + typecheck on PR) is included at `.github/workflows/ci.yml` as a starting point; extend it with a deploy step for your provider of choice if desired.
