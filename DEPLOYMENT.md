# SalesFlow AI — Deployment Guide

SalesFlow is a full-stack CRM with two parts that deploy separately:

- **`Backend/`** — Express + MongoDB API. Deploy to **Render** or **Railway**.
- **`frontend/`** — React (Vite) app. Deploy to **Vercel**.

The frontend is already wired to the real backend through `VITE_API_URL`. There is
no mock-data mode: without a running backend, login and data actions will fail.
The current Vercel preview shows the UI but needs the backend below to function.

---

## 1. Accounts and keys

| Service | For | Required? |
|---------|-----|-----------|
| **MongoDB Atlas** | Database | Yes |
| **OpenRouter** | AI email drafts / lead insights | Optional (AI features only) |

### MongoDB Atlas
1. Create a free M0 cluster at https://cloud.mongodb.com
2. Database Access → add a user + password.
3. Network Access → allow `0.0.0.0/0` (or your host's IPs).
4. Connect → Drivers → copy the `mongodb+srv://...` string, add your password and a db name, e.g. `/salesflow`.

### OpenRouter (optional)
1. https://openrouter.ai/keys → create a key. Leave blank to disable AI features.

---

## 2. Deploy the backend (`Backend/`) — Render

1. https://render.com → New → Web Service → connect this GitHub repo.
2. **Root Directory:** `Backend`
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. Environment variables (see `Backend/.env.example`):
   - `NODE_ENV=production`
   - `MONGO_URI=...`
   - `JWT_SECRET=...` (any long random string)
   - `JWT_EXPIRES_IN=7d`
   - `CLIENT_URL=` — leave blank for now, fill after step 3.
   - `OPENROUTER_API_KEY=...` (optional)
   - `OPENROUTER_MODEL=deepseek/deepseek-chat` (optional)
   - (Do **not** set `PORT`; Render provides it.)
6. Deploy. Note the URL, e.g. `https://salesflow-api.onrender.com`.
7. Health check: open `https://<your-backend>/api/health` — it should return `{"success":true,...}`.

---

## 3. Deploy the frontend (`frontend/`) — Vercel

The Vercel project already exists (`salesflow-ai`). Just add the env var and redeploy,
or import fresh with **Root Directory = `frontend`**.

1. Vercel → the `salesflow-ai` project → Settings → Environment Variables:
   - `VITE_API_URL=` → your backend URL **plus `/api`**, e.g. `https://salesflow-api.onrender.com/api`
2. Redeploy (Deployments → ⋯ → Redeploy, or push a commit).
3. Note the client URL, e.g. `https://salesflow-ai-sandy.vercel.app`.

---

## 4. Wire them together + seed data

1. In **Render** → backend → set `CLIENT_URL` to the Vercel client URL, redeploy (fixes CORS).
2. Seed a demo account + sample CRM data so you can log in:
   ```bash
   cd Backend
   cp .env.example .env      # fill in MONGO_URI at minimum
   npm install
   npm run seed              # creates the demo owner + leads/contacts/notes/tasks
   ```
   The seed creates a login you can use on the deployed site
   (see `Backend/seed.js` → `USER_EMAIL` / `USER_PASSWORD`).
   The login screen's "Use demo credentials" button pre-fills them.

Done. Visit the client URL and log in.

---

## Local development

```bash
# backend
cd Backend
cp .env.example .env      # fill values
npm install
npm run seed              # optional: demo data
npm run dev               # http://localhost:8000

# frontend (second terminal)
cd frontend
cp .env.example .env      # VITE_API_URL=http://localhost:8000/api
npm install
npm run dev               # http://localhost:5173
```
