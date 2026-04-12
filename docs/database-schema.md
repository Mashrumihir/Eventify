# Eventify Database Notes

This repository is currently a frontend-only React/Vite project. There is no backend server, no ORM, and no PostgreSQL connection in the codebase right now.

To help you move it to a real database-backed app, the full PostgreSQL schema has been added here:

- `docs/postgres-schema.sql`
- `docs/postgres-crud.sql`

Main tables included:

- `users`
- `user_profiles`
- `email_verification_tokens`
- `password_reset_tokens`
- `organizer_applications`
- `categories`
- `venues`
- `events`
- `ticket_types`
- `bookings`
- `booking_items`
- `payments`
- `wishlists`
- `reviews`
- `announcements`
- `notifications`
- `cms_pages`
- `platform_settings`

Run the schema with:

```sql
\i docs/postgres-schema.sql
```

or:

```bash
psql -U postgres -d eventify -f docs/postgres-schema.sql
```

CRUD example queries:

```bash
psql -U postgres -d eventify -f docs/postgres-crud.sql
```

If you want, the next step can be:

1. add a Node.js/Express backend with PostgreSQL connection
2. add Prisma or Sequelize models for these tables
3. connect the React pages to real APIs instead of mock data
