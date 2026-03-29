# RescueBite Admin Dashboard

## Introduction

Hello everyone, this is DevBros. We chose a problem from the ecotech domain to reduce food wastage from marriage halls, hotels, and similar places. This project closes the gap between food sources and people in need.

## Innovations

- **Adaptive Admin UX**: The dashboard employs a futuristic live-status UI pattern (e.g., animated wireframes, realtime metric cards, and progressive chart updates) to improve operational situational awareness and reduce cognitive load for admins.
- **Role-based data vantage + fail-safe auth**: Integrates Supabase role inference from donor/receiver records and provides an initial mock auth fallback path for quick local bootstrap while preserving secure JWT runtime for deployed systems.


## Dashboard Focus

This repository contains only the **Admin dashboard** implementation. The admin panel is intended to:

- manage and monitor all users (donors, NGOs, volunteers)
- oversee KYC review flow and listing approval
- track real-time metrics and activity logs
- enforce admin-level controls and auditability

---

## Existing Architecture

### Frontend (client)
- `admin/client/src/App.tsx`: Main route configuration with protected pages.
- `admin/client/src/pages`: Dashboard, UserManagement, KycReviews, Listings, Support, Analytics, ActivityLogs, Login.
- `admin/client/src/components`: `Layout`, `Sidebar`, `ProtectedRoute`.
- `admin/client/src/api/*`: REST calls to backend endpoints.
- `tailwindcss` styling with custom CSS and dynamic UI.

### Backend (server)
- `admin/server/src/index.ts`: Express server setup + routes.
- `admin/server/src/routes`: `auth`, `users`, `kyc`, `listings`, `stats`, `logs`.
- `admin/server/src/controllers`: Business logic + Supabase queries.
- `admin/server/src/config/database.ts`: Supabase clients configuration.
- `admin/server/src/utils/logger.ts`: event logging helper (used by user status updates).

### Database (Supabase)
- `admin/database/quick_setup.sql`: Creates `admin_users` table, seed admin user.
- Uses Supabase auth tables and app-specific tables: `donors`, `receivers`, `food_listings`, `admin_logs`.

---



## Prerequisites

- Node.js (>=18)
- npm (>=10)
- Supabase project with tables: `donors`, `receivers`, `food_listings`, `admin_users`, `admin_logs`
- Optional: Vercel account for deployment

---

## Environment Variables

Create `.env` in `admin/server` with:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=super-secret-key
PORT=5000
NODE_ENV=development
```

Frontend proxy is configured in Vite; no additional env is required by default.

---

## Local Setup

### 1. Database Setup

1. Open Supabase SQL editor.
2. Paste and run `admin/database/quick_setup.sql`.
3. Confirm `admin_users` created and seed admin user inserted.

> Default seeded credentials (from SQL script):
> - email: `admin@rescuebite.in`
> - password: `admin123456789012345` (in production, store hashed, never plain text).

### 2. Backend

```bash
cd admin/server
npm install
npm run build
npm run dev
```

- Dev server: `http://localhost:5000`
- Health check: `GET /health`

### 3. Frontend

```bash
cd admin/client
npm install
npm run dev
```

- Dev UI: `http://localhost:5173` (or port Vite reports)

---

## Authentication Flow

- Login page hits `POST /api/admin/auth/login`.
- On success: stores `adminToken` and `adminUser` in `localStorage`.
- `ProtectedRoute` blocks unauthenticated access and redirects to `/login`.
- `Layout` displays admin user info from `localStorage` including email and role.

---

## REST API Endpoints

### Admin auth
- `POST /api/admin/auth/login`
  - body: `{ email, password }`
  - response: `{ message, token, user: { email, role, userId? }} `

### Users
- `GET /api/users?type=<all|donor|ngo_admin|ngo_volunteer|ngo>`
- `GET /api/users/stats`
- `PUT /api/users/:id/status` (body `{ status, reason?}`)
- `GET /api/users/:id`

### KYC
- `GET /api/kyc/pending`
- `PUT /api/kyc/:id/review` (body `{ status: 'verified'|'rejected', user_type: 'donor'|'receiver'}`)

### Listings
- `GET /api/listings`
- `PUT /api/listings/:id/status` (body `{ status }`)

### Stats
- `GET /api/stats/dashboard`

### Logs
- `GET /api/logs`

---

## Admin UI Features

### Login
- Email/password form with error handling.
- Animated responsive UI.

### Dashboard
- Key metrics: total donors, receivers, active listings, pending KYC.
- Charts (`recharts`) and recent activity feed.

### User Management
- List users by type and status.
- Search and filter by name/email/role.
- Update status (`active`, `inactive`, etc.) and refresh stats.

### KYC Reviews
- Toggle donors/receivers tab.
- Review pending KYC entries.
- Approve/reject with confirm dialog.

### Listings
- List of food listings from DB.
- Update status (e.g. `available`, `pending`, etc.).

### Support
- Admin/support tickets (UI page exists; adapt backend if not yet implemented in server route).

### Analytics
- Trend charts and counts from `/api/stats/dashboard`.

### Activity Logs
- Read-only audit events from `/api/logs`.

---

## Deployment

### Vercel
- Root has `vercel.json` for combined deployment:
  - Frontend is built from `admin/client/package.json`
  - Backend is `admin/server/src/index.ts`
- Routes:
  - `/api/*` -> backend function
  - `/assets/*` -> static
  - `/*` -> frontend `index.html`
- Add Vercel environment variables for Supabase URL and keys.

### Production build

```bash
cd admin/client
npm run build
```

```bash
cd admin/server
npm run build
npm start
```

---

## Troubleshooting

- 401 on routes: ensure `adminToken` exists. In the current code, token validity is not enforced on server.
- DB missing tables: run `admin/database/quick_setup.sql`; verify `donors`, `receivers`, `food_listings`, `admin_logs` exist.
- Supabase errors: check `.env` keys and connection.
- CORS issues: server uses `cors()` default; for production set strict origin.

---

## Notes / TODO

- `authController` currently uses plain text password equality. Replace with hashed password (`bcrypt`) before prod.
- Add JWT middleware for all protected backend paths.
- Harden `admin_users` policies (not `ALLOW ALL`) for security.
- Add `refresh token` support and explicit logout route.
- Improve `Support` page backend route to store ticket updates.

---

## Contributing

1. Fork and clone.
2. `npm install` in `admin/client` and `admin/server`.
3. Add unit tests for routes and React components.
4. Open PR with description and testing details.

---

## Reference

- Frontend entrypoint: `admin/client/src/main.tsx`
- Backend entrypoint: `admin/server/src/index.ts`
- Supabase config: `admin/server/src/config/database.ts`
- Default admin setup script: `admin/database/quick_setup.sql`
