# Doctor Portal Backend

Backend API and database schema for Doctor Portal.

## Sprint 2 Status
- Backend routes were modularized by feature (`auth`, `patients`, `records`, `referrals`, `audit`).
- MySQL + Drizzle schema integration is active through `server/db.ts` and `shared/schema.ts`.
- Backend and database were separated from the frontend into this dedicated repository.

## Scope
- Express + TypeScript REST API (`server/`)
- Drizzle ORM schema and validation (`shared/schema.ts`)
- MySQL connection and database tooling (`server/db.ts`, `drizzle.config.ts`)
- SQL schema asset (`attached_assets/schema_1771444245774.sql`)

## Requirements
- Node.js 18+
- npm
- MySQL

## Environment
Create a `.env` file with:

```env
DATABASE_URL=mysql://<username>:<password>@<host>:3306/<database_name>
PORT=5000
```

## Run
```bash
npm install
npm run db:push
npm run dev
```

## Build and start
```bash
npm run build
npm run start
```

## Key folders
- `server/` API routes, modules, and runtime
- `shared/` Drizzle schema + zod contracts
- `attached_assets/` database diagram and SQL asset
- `script/build.ts` backend production bundle

## Branch Workflow
- `main`: stable backend/database code
- `develop`: integration branch for upcoming sprint work
- `feature/<name>`: short-lived feature branches opened from `develop`, then merged back into `develop`
