# AGENTS.md

Instructions for AI coding agents (and humans) working in this repository.

This project is **server-only**. Do not generate frontend/UI code here — this
repo exposes an API that a separate frontend consumes. Before making changes,
read the relevant sections below in full.

---

## Stack

- **Runtime/Framework:** Node.js + **Express** (JavaScript, not TypeScript — unless the repo already has `.ts` files, in which case follow that)
- **ORM:** Prisma
- **Auth:** Better Auth
- **Email:** Resend (only used where transactional email is actually required)
- **Sessions:** Cookie-based, via Better Auth's cookie handling

---

## Before doing anything

1. **Read the frontend repo/folder first.** Before adding, renaming, or changing any route, request/response shape, cookie name, or auth flow, locate and read the frontend codebase (adjacent folder, monorepo package, or linked repo) to see:
   - What base URL / API paths it expects
   - What field names and payload shapes it sends and expects back
   - How it currently handles auth (cookie-based fetch with `credentials: 'include'`, tokens, etc.)
   - Its CORS origin(s) in dev and prod
2. **Never break the existing contract** the frontend relies on without updating the frontend accordingly, or without explicitly flagging the breaking change to the user.
3. Check `package.json`, `prisma/schema.prisma`, `src/lib/auth.js`, and `src/lib/resend.js` before creating new files — extend existing patterns instead of duplicating them.

---

## Folder structure

Follow this structure. Don't invent parallel folders (e.g. `controller/` vs `controllers/`) — check what already exists before adding new ones.

```
src/
├── index.js                    # entrypoint: creates the Express app, starts the server
├── app.js                      # Express app setup: middleware, route mounting, error handler
├── config/
│   ├── env.js                   # loads & validates process.env (fail fast on missing vars)
│   └── cors.js                   # CORS allow-list config, driven by FRONTEND_URL
├── lib/
│   ├── prisma.js                 # Prisma client singleton
│   ├── auth.js                    # Better Auth instance/config (Prisma adapter wired in)
│   └── resend.js                   # Resend client singleton
├── routes/
│   ├── index.js                     # combines and mounts all routers
│   ├── auth.routes.js                # mounts Better Auth handler on /api/auth/*
│   ├── user.routes.js
│   └── <feature>.routes.js
├── controllers/
│   ├── user.controller.js             # request/response handling only, no business logic
│   └── <feature>.controller.js
├── services/
│   ├── user.service.js                 # business logic, talks to Prisma
│   └── <feature>.service.js
├── middlewares/
│   ├── auth.middleware.js               # session check via Better Auth, attaches req.user
│   ├── error.middleware.js               # centralized error handler (last middleware in app.js)
│   ├── validate.middleware.js             # runs Zod schemas against req.body/query/params
│   └── rateLimiter.middleware.js
├── validators/
│   ├── user.validator.js                  # Zod schemas per resource
│   └── <feature>.validator.js
├── emails/
│   ├── templates/                          # email templates sent via Resend
│   └── send.js                              # thin wrapper functions e.g. sendVerificationEmail()
└── utils/
    ├── asyncHandler.js                       # wraps async route handlers to forward errors
    └── logger.js

prisma/
├── schema.prisma
└── migrations/

.env
.env.example
.gitignore
package.json
```

**Layering rule:** `routes` → `controllers` → `services` → `prisma`. Controllers never call Prisma directly; services never touch `req`/`res`. This keeps auth middleware and validation testable in isolation and makes it obvious where Better Auth's session check plugs in (`middlewares/auth.middleware.js`) versus where Resend gets called (`services/*.service.js` or Better Auth's email hooks — not controllers).

Use `express.Router()` per resource in `routes/`, mounted centrally in `routes/index.js`, which is mounted once in `app.js`. Use `utils/asyncHandler.js` (or `express-async-errors`) so async errors in controllers reach `error.middleware.js` instead of crashing the process.

---

## Prisma

- Single source of truth: `prisma/schema.prisma`. Never hand-edit generated client code in `node_modules/.prisma`.
- After any schema change: `npx prisma migrate dev --name <change>` locally, `npx prisma migrate deploy` in production — never `db push` in production.
- Instantiate Prisma **once** and reuse it via `src/lib/prisma.js`:

  ```js
  import { PrismaClient } from '@prisma/client'

  const globalForPrisma = globalThis
  export const prisma = globalForPrisma.prisma ?? new PrismaClient()
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
  ```

- Never expose raw Prisma errors to clients — catch in `error.middleware.js` and return sanitized messages.
- Use `select`/`omit` so password hashes, tokens, and internal fields never leak in API responses.

---

## Better Auth

- Configuration lives in a single `src/lib/auth.js` — do not scatter auth config across files.
- Use the Prisma adapter, pointed at the same `prisma` singleton.
- Mount Better Auth's handler on its own router (`src/routes/auth.routes.js`, e.g. `/api/auth/*`) and let it manage session creation, cookie issuance, and CSRF — **do not hand-roll session/cookie logic in parallel.**
- Protect routes with `middlewares/auth.middleware.js`, which checks the session via Better Auth and attaches `req.user`. Never trust a `userId` sent in the request body.
- Secrets (`BETTER_AUTH_SECRET`, `DATABASE_URL`, etc.) live only in environment variables, never committed.

---

## Cookies — best practice checklist

Whenever cookies are set (via Better Auth or manually), they must be:

- `httpOnly: true` — never readable from client-side JS
- `secure: true` in production (allow `false` only on plain-HTTP localhost)
- `sameSite: 'lax'` by default; use `'none'` (with `secure: true`) **only** if the frontend is on a different origin and needs cross-site cookies — confirm this against what you read in the frontend
- Scoped with an explicit `path` (usually `/`) and, if cross-subdomain auth is needed, an explicit `domain` (`COOKIE_DOMAIN`)
- Given a sane `maxAge`/expiry matching the session strategy configured in Better Auth
- Signed/encrypted — rely on Better Auth's built-in signing rather than inventing your own

If the frontend is on a different origin than the API:
- Enable CORS via `config/cors.js` with `credentials: true` and an explicit allow-list from `FRONTEND_URL` (never `*` when credentials are involved)
- The frontend must fetch with `credentials: 'include'`

---

## Resend (email)

- Only wire up Resend for flows that actually need transactional email: verification, password reset, magic links, notifications.
- Single client in `src/lib/resend.js`:

  ```js
  import { Resend } from 'resend'
  export const resend = new Resend(process.env.RESEND_API_KEY)
  ```

- Trigger sends from Better Auth's hooks (`sendVerificationEmail`, `sendResetPassword`) or from `src/emails/send.js` wrapper functions called by services — not directly from controllers.
- Never put `RESEND_API_KEY` anywhere that ships to the client.
- Fail gracefully: log failed sends with a clear error; don't silently swallow them, and don't block account creation on email delivery unless the product requires verified-before-use accounts.

---

## Environment variables

Defined in `.env.example` (template, committed) and `.env` (real values, gitignored):

```
PORT=4000
NODE_ENV=development

DATABASE_URL=

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

RESEND_API_KEY=
EMAIL_FROM=

FRONTEND_URL=
COOKIE_DOMAIN=
```

Load and validate these in `src/config/env.js` at startup — fail fast if a required variable is missing, rather than failing later mid-request. Never commit `.env`. Update `.env.example` whenever a new variable is introduced.

---

## .gitignore

Must at minimum ignore: `.env` and variants, `node_modules/`, build output (`dist/`, `build/`), logs, and editor/OS files. See the repo's `.gitignore` — keep it in sync if new tooling (test coverage, generated Prisma clients, etc.) adds new artifacts.

---

## General conventions

- Validate all incoming request bodies (Zod schemas in `validators/`, run via `validate.middleware.js`) before touching Prisma or Better Auth.
- Consistent error shape across the API, e.g. `{ error: { message, code } }`.
- Log server errors with enough context to debug, but never log passwords, tokens, or full cookie values.
- Write only server-side code here (routes, middleware, Prisma models, auth config, email templates rendered server-side). If a task seems to require frontend changes, stop and say so instead of guessing at the frontend's code.