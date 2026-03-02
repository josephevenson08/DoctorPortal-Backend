# Doctor Portal Backend

Backend API and database schema for Doctor Portal.

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
