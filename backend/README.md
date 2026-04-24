# Eventify Backend

This folder contains the Express and PostgreSQL backend for Eventify login and registration.

## Files

- `package.json` - backend scripts and dependencies
- `.env` - local database connection settings
- `.env.example` - sample environment variables
- `db/schema.sql` - PostgreSQL table creation SQL
- `db/sync.sql` - PostgreSQL schema repair SQL for existing databases
- `scripts/init-db.js` - creates database tables from `db/schema.sql`
- `scripts/sync-db.js` - syncs an existing database to the current schema
- `scripts/seed-attendee-demo.js` - inserts attendee dashboard demo data
- `src/config/env.js` - loads backend environment variables
- `src/config/db.js` - PostgreSQL connection pool
- `src/controllers/authController.js` - register and login database logic
- `src/routes/authRoutes.js` - auth API routes
- `src/middleware/errorHandler.js` - API error handler
- `src/utils/asyncHandler.js` - async route helper
- `src/utils/roles.js` - frontend/backend role mapping
- `src/app.js` - Express app setup
- `src/server.js` - backend server start file

## Setup

Create a PostgreSQL database named `eventify`.

If your PostgreSQL password is different, update `DATABASE_URL` in `.env`.

```bash
cd backend
npm install
npm run db:init
npm run dev
```

If you already have a local database from an older version, run this once before starting:

```bash
npm run db:sync
```

If you want demo attendee bookings, wishlist, and upcoming events for the attendee dashboard:

```bash
npm run db:seed-attendee
```

To seed data for a specific attendee account (recommended for your logged-in user):

```bash
npm run db:seed-attendee -- --email=your-email@example.com
```

You can also target by user id or name:

```bash
npm run db:seed-attendee -- --userId=your-user-uuid
npm run db:seed-attendee -- --name="Your Full Name"
```

Backend API:

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`

Frontend uses:

```env
VITE_API_URL=http://localhost:5000/api
```
