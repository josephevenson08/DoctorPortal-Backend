# Doctor-Patient Record Management System

## Description
A full-stack web application for managing doctor-patient relationships, medical records, and referrals. Created for learning and academic purposes.

## Database Schema
The database includes the following entities:
- Patient
- Doctor
- Medical Record
- Referral

## Files
- `Blank_diagram.png` - ER diagram of the database schema

## Frontend - Sprint 2 (josephevenson08)

### Pages
- `client/src/pages/auth.tsx` - Login page
- `client/src/pages/signup.tsx` - Create account page with password strength gauge
- `client/src/pages/mfa.tsx` - Two-factor authentication page with dark bordered input boxes
- `client/src/pages/forgot-password.tsx` - Password reset page
- `client/src/pages/dashboard/home.tsx` - Main dashboard overview
- `client/src/pages/dashboard/patients.tsx` - Patient management
- `client/src/pages/dashboard/records.tsx` - Medical records
- `client/src/pages/dashboard/referrals.tsx` - Referrals management (filtered by logged-in doctor)
- `client/src/pages/dashboard/settings.tsx` - Settings page

### Components
- `client/src/components/layout/dashboard-layout.tsx` - Sidebar, header, live clock, logout confirmation dialog

### Database Connection
- `shared/schema.ts` - MySQL database schema
- `server/db.ts` - MySQL database connection
- `server/storage.ts` - Database queries
