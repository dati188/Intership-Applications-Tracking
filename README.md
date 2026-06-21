# Trackline — Internship Application Tracker

A full-stack tracker for managing internship applications: pipeline stages, interview rounds,
contacts, documents, salary info, and an analytics dashboard.

**Stack:** React (Vite) + Tailwind · Node/Express · MongoDB (Mongoose) · JWT auth

```
interview-tracker/
├── backend/      Express API (auth, applications, analytics)
└── frontend/     React app (Vite, Tailwind, Recharts)
```

---

## 1. Prerequisites

- Node.js 18+
- A MongoDB database. Easiest option: a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
  - Create a free (M0) cluster.
  - Add a database user (Database Access tab).
  - Allow access from your IP, or `0.0.0.0/0` for simplicity while developing.
  - Copy the connection string (Connect → Drivers) — looks like
    `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/interview-tracker`

---

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/interview-tracker
JWT_SECRET=<generate a long random string>
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Generate a strong `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Run it:

```bash
npm run dev      # nodemon, auto-restarts on changes
# or
npm start        # plain node
```

You should see `MongoDB connected: ...` and `Server running on port 5000`.

Optional: seed some sample data (creates `demo@example.com` / `password123` with 5 sample applications):

```bash
npm run seed
```

Health check: `GET http://localhost:5000/api/health` → `{ "status": "ok" }`

---

## 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

`.env`:

```
VITE_API_URL=http://localhost:5000/api
```

Run it:

```bash
npm run dev
```

Visit `http://localhost:5173`. Register an account (or log in with the seeded demo account)
and you're in.

---

## 4. How the data model works

**Application** is the core document. Each one has:
- Core fields: `company`, `role`, `location`, `remote`, `status`, `priority`, `appliedDate`, `deadline`, `jobPostingUrl`, `source`, `tags`, `notes`
- `salary` — amount, period (hourly/monthly/yearly/stipend), currency, negotiated flag
- `rounds[]` — embedded interview rounds: type, title, date, outcome, interviewers, notes
- `contacts[]` — embedded contacts: name, role, email, phone, linkedin, notes
- `documents[]` — embedded document links: label, type, url, notes

`status` drives the pipeline columns: Wishlist → Applied → Phone Screen → Interviewing → Offer → Accepted,
with Rejected/Withdrawn as side-exits.

The analytics endpoint (`GET /api/analytics/summary`) computes response rate, interview conversion rate,
offer rate, applications-over-time, rounds-by-type, upcoming interviews, and average days-to-first-response
— all derived from the applications already in the database, no separate analytics storage needed.

---

## 5. API reference (quick)

All routes except `/auth/register` and `/auth/login` require `Authorization: Bearer <token>`.

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Current user |
| GET | `/api/applications` | List (filters: `status`, `search`, `archived`, `sort`, `tag`) |
| POST | `/api/applications` | Create |
| GET/PUT/DELETE | `/api/applications/:id` | Read/update/delete one |
| POST | `/api/applications/:id/rounds` | Add interview round |
| PUT/DELETE | `/api/applications/:id/rounds/:roundId` | Update/remove round |
| POST | `/api/applications/:id/contacts` | Add contact |
| DELETE | `/api/applications/:id/contacts/:contactId` | Remove contact |
| POST | `/api/applications/:id/documents` | Add document link |
| DELETE | `/api/applications/:id/documents/:documentId` | Remove document |
| GET | `/api/analytics/summary` | Dashboard stats |

---

## 6. Deploying

### Backend → Render (or Railway)

**Render:**
1. Push this repo to GitHub.
2. New → Web Service → connect the repo, set root directory to `backend`.
3. Build command: `npm install`. Start command: `npm start`.
4. Add environment variables from your `.env` (`MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`, `NODE_ENV=production`). Render sets `PORT` itself — your code already reads `process.env.PORT`.
5. Once deployed, note the URL, e.g. `https://trackline-api.onrender.com`.

**Railway:** same idea — new project from GitHub repo, set root directory to `backend`, add the same env vars, deploy.

Either way, set `CLIENT_URL` to your deployed frontend URL once you have it (step below), so CORS allows it. You can pass multiple comma-separated origins if needed.

### Frontend → Vercel (or Netlify)

1. New project → import the repo, root directory `frontend`.
2. Framework preset: Vite. Build command `npm run build`, output dir `dist` (Vercel usually auto-detects this).
3. Add environment variable `VITE_API_URL` = your backend URL + `/api`, e.g. `https://trackline-api.onrender.com/api`.
4. Deploy. Then go back and update the backend's `CLIENT_URL` env var to this frontend URL and redeploy the backend so CORS allows it.

### MongoDB Atlas network access for production

If your backend host has a fixed outbound IP range, you can restrict Atlas's IP allowlist to it. Otherwise `0.0.0.0/0` (allow from anywhere) is the common approach for small personal projects — just keep your DB user password strong and your `JWT_SECRET` private.

---

## 7. Notes / things you might want to extend

- Drag-and-drop in the Pipeline view uses native HTML5 drag events — works on desktop; on mobile you tap a card to open it and change status from the dropdown instead.
- Document "uploads" are link-based (paste a Google Drive/Dropbox link) rather than file storage, to keep the backend simple — wiring up actual file storage (e.g. S3) would be the natural next step if you want true uploads.
- Status enum values live in both `backend/src/models/Application.js` and `frontend/src/utils/constants.js` — if you add a new status, update both.
