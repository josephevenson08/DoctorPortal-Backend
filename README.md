# Doctor-Patient Record Management System

A full-stack healthcare workflow app for managing doctor accounts, patients, medical records, referrals, and audit logs.

## Overview

This project provides:
- Authentication flows for doctors (register, login, logout)
- Dashboard modules for patients, medical records, and referrals
- Audit log tracking for key authentication events
- Shared TypeScript schema between frontend and backend
- MySQL persistence through Drizzle ORM

## System Architecture

- Frontend: React + TypeScript single-page app served by Vite
- Backend: Express + TypeScript REST API
- Database: MySQL with Drizzle ORM schema and queries
- Shared contract: `shared/schema.ts` (types + validation schemas)

## Frontend

Frontend source is in `client/src`.

### Routing
- `/login` and `/` -> Login page
- `/signup` -> Account registration
- `/mfa` -> MFA verification screen
- `/forgot-password` -> Password reset flow UI
- `/dashboard` -> Dashboard home
- `/dashboard/patients` -> Patient management
- `/dashboard/records` -> Medical records management
- `/dashboard/referrals` -> Referral management
- `/dashboard/settings` -> Settings
- `/audit-log` -> Admin audit log view

### Frontend features
- React Query for server-state fetching/caching
- Form dialogs for create/edit flows
- Filtering/search across modules
- Local storage usage for current logged-in user context
- UI component system under `client/src/components/ui`

## Backend

Backend source is in `server`.

### API capabilities
- Auth:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
- Doctors:
  - `GET /api/doctors`
- Patients (CRUD):
  - `GET /api/patients`
  - `GET /api/patients/:id`
  - `POST /api/patients`
  - `PATCH /api/patients/:id`
  - `DELETE /api/patients/:id`
- Medical Records (CRUD):
  - `GET /api/records`
  - `GET /api/records/:id`
  - `GET /api/records/patient/:patientId`
  - `POST /api/records`
  - `PATCH /api/records/:id`
  - `DELETE /api/records/:id`
- Referrals (CRUD):
  - `GET /api/referrals`
  - `GET /api/referrals/:id`
  - `POST /api/referrals`
  - `PATCH /api/referrals/:id`
  - `DELETE /api/referrals/:id`
- Audit Logs:
  - `GET /api/audit-logs?passcode=999999`

### Backend internals
- `server/routes.ts`: route handlers and request validation
- `server/storage.ts`: database access layer
- `server/db.ts`: database connection bootstrap
- `server/index.ts`: app startup, middleware, and HTTP server

## Database

### Engine
- MySQL (via `DATABASE_URL`)

### ORM and schema
- Drizzle ORM for data access
- Drizzle schema and types defined in `shared/schema.ts`
- Validation generated with `drizzle-zod` and enforced in routes

### Core tables
- `users` (doctor accounts)
- `patients`
- `medical_records`
- `referrals`
- `audit_logs`

### Database tooling
- `drizzle.config.ts` configures schema path and migration output
- `npm run db:push` applies schema changes to the configured MySQL database

## Project Structure

- `client/` -> Frontend app
- `server/` -> Backend API and runtime server
- `shared/` -> Shared DB schema/types between client/server
- `attached_assets/` -> Additional project assets
- `Blank_diagram.png` -> ER-style schema diagram

## Setup and Run

### Prerequisites
- Node.js 18+
- npm
- MySQL running locally or remotely

## Tools and Languages Used

### Languages
- TypeScript
- SQL (MySQL)
- HTML/CSS

### Frontend stack
- React 19
- Wouter (routing)
- Tailwind CSS

### Backend stack
- Node.js
- Express 5

### Database stack
- MySQL
- Drizzle ORM
- mysql2

### Build and developer tooling
- Vite
- tsx
- TypeScript compiler (`tsc`)
- cross-env

## Notes

- The audit log route currently uses a static passcode (`999999`) for access control.
- Passwords are stored as plain text in the current implementation; production usage should add secure hashing (for example, bcrypt/argon2).
