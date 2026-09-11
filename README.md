# 🍽️ CheafIn

> A job-board platform connecting **chefs** with **restaurants**.

---

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Client   | React 19, Vite, Tailwind CSS v4, Axios  |
| Server   | Node.js, Express 4, better-auth         |
| Database | SQLite (Prisma ORM)                     |
| Auth     | [better-auth](https://better-auth.com) (session cookies) |

---

## Project Structure

```
cheafin/
├── client/              # React + Vite frontend (port 5173)
│   └── src/
│       ├── lib/api.js       # Axios instance + typed helpers
│       ├── pages/           # Route pages
│       ├── components/      # Shared UI components
│       └── hooks/           # Custom React hooks
└── server/              # Express API backend (port 4000)
    └── src/
        ├── routes/          # Express routers
        ├── controllers/     # Request handlers
        ├── services/        # Business logic
        ├── middlewares/     # Auth, rate limiter, error handler
        ├── validators/      # Zod schemas
        └── config/          # env, cors, prisma
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### 1 — Clone & install

```bash
# Server
cd server && npm install

# Client
cd ../client && npm install
```

### 2 — Configure environment

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=4000
NODE_ENV=development
DATABASE_URL="file:./prisma/dev.db"
BETTER_AUTH_SECRET="replace-with-a-random-32-character-secret"
BETTER_AUTH_URL="http://localhost:4000"
FRONTEND_URL="http://localhost:5173"
```

### 3 — Set up the database

```bash
cd server
npm run prisma:migrate      # run migrations
npm run prisma:generate     # generate Prisma client
```

### 4 — Run both servers

```bash
# Terminal 1 — API server
cd server && npm run dev

# Terminal 2 — React client
cd client && npm run dev
```

| App    | URL                       |
|--------|---------------------------|
| Client | http://localhost:5173     |
| Server | http://localhost:4000     |

---

## API Reference

> **Base URL:** `http://localhost:4000`
>
> All `/api/*` routes require an active session (cookie). Sign in first.  
> In development, Vite proxies `/api/*` so relative paths work from the browser at `http://localhost:5173`.

---

### 🔑 Auth — `/api/auth/*`

Managed by **better-auth**. Cookies are set automatically on sign-in.

| Method | Path                        | Description                     | Browser? |
|--------|-----------------------------|---------------------------------|:--------:|
| `GET`  | `/api/auth/session`         | Get current session info        | ✅       |
| `POST` | `/api/auth/sign-up/email`   | Register with email + password  | ❌       |
| `POST` | `/api/auth/sign-in/email`   | Sign in                         | ❌       |
| `POST` | `/api/auth/sign-out`        | Sign out (clears session)       | ❌       |

**Open in browser:**  
→ http://localhost:4000/api/auth/session

**Sign up (curl):**
```bash
curl -c cookies.txt -X POST http://localhost:4000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{"email":"chef@example.com","password":"secret123","name":"Gordon"}'
```

**Sign in (curl):**
```bash
curl -c cookies.txt -X POST http://localhost:4000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email":"chef@example.com","password":"secret123"}'
```

---

### 👤 Users — `/api/users`

> All routes require authentication.

| Method  | Path             | Description                     | Browser? |
|---------|------------------|---------------------------------|:--------:|
| `GET`   | `/api/users/me`  | Get signed-in user's profile    | ✅       |
| `PATCH` | `/api/users/me`  | Update signed-in user's profile | ❌       |

**Open in browser:**  
→ http://localhost:4000/api/users/me

**Update profile (curl):**
```bash
curl -b cookies.txt -X PATCH http://localhost:4000/api/users/me \
  -H "Content-Type: application/json" \
  -d '{"name":"Gordon Ramsay","bio":"Head Chef"}'
```

---

### 💼 Jobs — `/api/jobs`

> All routes require authentication.

| Method | Path                            | Description                       | Browser? |
|--------|---------------------------------|-----------------------------------|:--------:|
| `GET`  | `/api/jobs`                     | List all available jobs           | ✅       |
| `GET`  | `/api/jobs/dashboard`           | Recruiter dashboard               | ✅       |
| `POST` | `/api/jobs`                     | Create a new job posting          | ❌       |
| `POST` | `/api/jobs/:jobId/applications` | Apply to a job                    | ❌       |

**Open in browser:**  
→ http://localhost:4000/api/jobs  
→ http://localhost:4000/api/jobs/dashboard

**Create a job (curl):**
```bash
curl -b cookies.txt -X POST http://localhost:4000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"title":"Head Chef","description":"Experienced head chef needed","location":"Mumbai","salary":80000}'
```

**Apply to a job (curl):**
```bash
curl -b cookies.txt -X POST http://localhost:4000/api/jobs/JOB_ID_HERE/applications
```

---

### 🏥 Health Check

| Method | Path      | Description     | Browser? |
|--------|-----------|-----------------|:--------:|
| `GET`  | `/health` | Server liveness | ✅       |

**Open in browser:**  
→ http://localhost:4000/health

---

## Client API Helpers

[`client/src/lib/api.js`](./client/src/lib/api.js) exports a configured axios instance and typed helpers:

```js
import api, { userApi, jobApi } from './lib/api';

// Users
const { data } = await userApi.getMe();
await userApi.updateMe({ name: 'Gordon' });

// Jobs
const { data } = await jobApi.getJobs();
await jobApi.getDashboard();
await jobApi.createJob({ title: 'Sous Chef', location: 'Delhi', salary: 60000 });
await jobApi.apply('job-uuid-here');

// Raw instance (custom requests)
await api.get('/api/health');
```

---

## .gitignore Status

| Location   | File          | Status   | Covers                                     |
|------------|---------------|----------|--------------------------------------------|
| `/`        | `.gitignore`  | ✅ Exists | `node_modules/`, `dist/`                  |
| `server/`  | `.gitignore`  | ✅ Exists | `node_modules/`, `.env`, `*.db`, `*.log`  |
| `client/`  | `.gitignore`  | ⚠️ None  | Relies on root `.gitignore`               |
| Global     | —             | ✅ None  | No global gitignore configured (clean)    |

---

## npm Scripts

### Server (`cd server`)

```bash
npm run dev              # Start with hot reload (node --watch)
npm run start            # Start in production mode
npm run prisma:migrate   # Run DB migrations
npm run prisma:generate  # Regenerate Prisma client
```

### Client (`cd client`)

```bash
npm run dev      # Vite dev server → http://localhost:5173
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
```

---

## License

MIT
