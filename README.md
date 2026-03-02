# Doctor Portal Frontend

Frontend web application for Doctor Portal.

## Scope
- React + TypeScript single-page application
- Dashboard UI for auth, patients, records, referrals, and settings
- API integration against backend `/api/*` endpoints
- Shared frontend types from `shared/schema.ts`

## Requirements
- Node.js 18+
- npm

## Run locally
```bash
npm install
npm run dev
```

Default dev URL:
- `http://localhost:5000`

## Build and preview
```bash
npm run build
npm run start
```

## Backend dependency
This repository is frontend-only.

Backend API and database now live in:
- `https://github.com/josephevenson08/DoctorPortal-Backend`

Set up your backend and run it separately, then ensure frontend requests to `/api/*` are routed to that backend in your environment.

## Key folders
- `client/` frontend app source
- `shared/` shared TypeScript contracts consumed by frontend
- `attached_assets/` non-database project assets
