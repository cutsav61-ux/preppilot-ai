# API Reference

Base URL: `{API_BASE_URL}/api/v1` (default local: `http://localhost:5000/api/v1`)

All responses use the envelope:
```json
{ "success": true, "data": { ... }, "message": "optional", "meta": { "page": 1, "limit": 10, "total": 42, "totalPages": 5 } }
```
Errors: `{ "success": false, "message": "...", "error": { "code": "SOME_CODE", "details": ... } }`

Protected routes require `Authorization: Bearer <accessToken>`. The refresh token itself is never sent by the client explicitly — it's an httpOnly signed cookie scoped to `/api/v1/auth`, sent automatically by the browser.

## Auth — `/auth`
| Method | Path | Auth | Body | Notes |
|---|---|---|---|---|
| POST | `/signup` | Public | `{ name, email, password }` | Rate-limited |
| POST | `/login` | Public | `{ email, password }` | Rate-limited |
| POST | `/refresh` | Refresh cookie | — | Rotates both tokens |
| POST | `/logout` | Protected | — | Deletes the refresh token server-side |
| GET | `/me` | Protected | — | Current user |
| POST | `/forgot-password` | Public | `{ email }` | Always returns success (doesn't leak account existence) |
| POST | `/reset-password` | Public | `{ token, password }` | Invalidates all sessions on success |

## Users — `/users`
| Method | Path | Body | Notes |
|---|---|---|---|
| GET | `/profile` | — | |
| PUT | `/profile` | `{ name?, bio?, targetRole?, experienceLevel?, avatarUrl? }` | |
| PUT | `/password` | `{ currentPassword, newPassword }` | Invalidates all other sessions |
| PUT | `/settings` | `{ theme?, emailNotifications?, defaultInterviewType?, defaultDifficulty? }` | |
| DELETE | `/account` | `{ password }` | Cascades: deletes all interviews + sessions |
| GET | `/export-data` | — | Downloads a JSON file of profile + interviews |
| GET | `/sessions` | — | Lists active refresh-token sessions |
| DELETE | `/sessions/:id` | — | Revoke one session |
| DELETE | `/sessions/all` | — | Revoke every session (forces re-login everywhere) |

## Interviews — `/interviews`
| Method | Path | Body/Query | Notes |
|---|---|---|---|
| POST | `/` | `{ type, difficulty, topic, company?, numQuestions }` | Generates questions via AI |
| GET | `/` | `?page&limit&type&difficulty&status&search` | `search` matches topic or company (case-insensitive) |
| GET | `/:id` | — | |
| POST | `/:id/answers` | `{ questionOrder, answerText, timeTakenSeconds }` | |
| POST | `/:id/complete` | — | Triggers full AI evaluation |
| PATCH | `/:id/abandon` | — | |

## History — `/history`
Identical data/shape to `/interviews` and `/interviews/:id` — same controller, different path, provided as a named alias per the product spec.
| Method | Path | Query |
|---|---|---|
| GET | `/` | Same as `/interviews` |
| GET | `/:id` | Same as `/interviews/:id` |

## Analytics — `/analytics`
| Method | Path | Notes |
|---|---|---|
| GET | `/` | Combined summary: highest/lowest score, success rate, completion rate, skill averages, monthly + weekly progress, type/difficulty distribution |
| GET | `/overview` | Lightweight — mirrors `User.stats` |
| GET | `/score-trend` | `?range=30d\|90d\|all` |
| GET | `/category-breakdown` | Average score per topic/role |

## Reports — `/reports`
| Method | Path | Notes |
|---|---|---|
| GET | `/:id` | Streams a PDF (`application/pdf`) for a completed/abandoned interview |

## Health
| Method | Path | Auth |
|---|---|---|
| GET | `/health` | Public |
