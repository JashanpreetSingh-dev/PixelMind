# PixelMind

Pixel habit tracking, night journaling, and AI memory in one place. A home-screen app that turns your habits, nightly reflections, and patterns into a living mosaic of your life.

This repo is a monorepo: FastAPI backend + Next.js PWA frontend, with Clerk auth and MongoDB.

## Stack

| Part | Tech |
|------|------|
| **Web** | Next.js 16, React 19, TypeScript, Tailwind CSS, Clerk, Jotai, TanStack Query, Framer Motion |
| **API** | FastAPI, Python 3.x, MongoDB (Motor), Clerk (JWT auth) |
| **Auth** | [Clerk](https://clerk.com) (shared between web and API) |

## Project structure

```
PixelMind/
├── api/          # FastAPI backend (habits, journal, user data)
├── web/          # Next.js PWA (app, onboarding, settings, mosaic)
├── openspec/     # Design docs and specs
└── README.md
```

## Prerequisites

- **Node.js** 18+ and npm (for `web/`)
- **Python** 3.10+ and pip (for `api/`)
- **MongoDB** (local or Atlas)
- **Clerk** account and app (for auth)

## Quick start

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/PixelMind.git
cd PixelMind
```

### 2. API (backend)

```bash
cd api
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

pip install -r requirements.txt
```

Create `api/.env` (see [Environment](#environment) below), then:

```bash
uvicorn main:app --reload
```

API runs at **http://localhost:8000** (docs at http://localhost:8000/docs).

### 3. Web (frontend)

```bash
cd web
npm install
```

Create `web/.env.local` with your Clerk and API URLs (see [Environment](#environment)), then:

```bash
npm run dev
```

App runs at **http://localhost:3000**.

## Environment

### API (`api/.env`)

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `CLERK_FRONTEND_API` | Clerk Frontend API URL (e.g. `https://your-app.clerk.accounts.dev`) |
| `CLERK_JWKS_URL` | Optional; defaults to `{CLERK_FRONTEND_API}/.well-known/jwks.json` |

### Web (`web/.env.local`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `NEXT_PUBLIC_API_URL` | Backend base URL (e.g. `http://localhost:8000`) |

Configure the same Clerk application for both API and web so JWTs are valid across both.

## Scripts

### Web

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — run production build
- `npm run lint` — ESLint

### API

- `uvicorn main:app --reload` — development
- `uvicorn main:app --host 0.0.0.0 --port 8000` — production-style

## PWA

The web app is a Progressive Web App (installable, offline-capable). Icons and manifest live under `web/public/` and `web/src/app/manifest.ts`.

## License

Private / unlicensed unless stated otherwise.
