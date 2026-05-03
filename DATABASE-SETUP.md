# Eventify Database Setup Guide
## Complete PostgreSQL Connection & Configuration

---

## 📁 Files Created

### Core Database Files
| File | Purpose |
|------|---------|
| `backend/src/config/database.js` | **Main database module** - Pool, transactions, helpers |
| `backend/src/config/db.js` | Legacy re-export (backward compatible) |
| `backend/src/config/env.js` | Environment variables (updated) |
| `backend/database-schema-complete.sql` | Full database schema |
| `backend/.env.example` | Environment template |

### Utility Scripts
| File | Purpose |
|------|---------|
| `backend/scripts/init-database.js` | Initialize database with schema |
| `backend/scripts/test-database.js` | Test connection & verify setup |

---

## 🚀 Quick Start (3 Steps)

### Step 1: Configure Environment

Create `.env` file in `backend/` folder:

```bash
# Copy from example
cp backend/.env.example backend/.env

# Or create manually
```

**Minimum required in `.env`:**
```env
PORT=5000
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://postgres:Mihir1234@localhost:5432/eventify_db
JWT_SECRET=your-secret-key-min-32-characters-long
```

### Step 2: Initialize Database

```bash
cd backend

# Method 1: Using script (Recommended)
node scripts/init-database.js

# Method 2: Using pgAdmin
# Open database-schema-complete.sql in pgAdmin Query Tool
# Press F5 to execute
```

### Step 3: Test Connection

```bash
# Test database connection
node scripts/test-database.js

# Expected output:
# ✅ Connection successful
# ✅ Query successful - Found 30 tables
# ✅ Stats retrieved
# ✅ Schema is complete!
```

---

## 🔌 Using Database in Code

### Basic Queries

```javascript
// Import the database module
import { query, queryOne, transaction } from './config/database.js';

// Simple query
const result = await query('SELECT * FROM users WHERE id = $1', [userId]);
const user = result.rows[0];

// Get single row
const user = await queryOne('SELECT * FROM users WHERE email = $1', [email]);

// Get single value
const count = await queryValue('SELECT COUNT(*) FROM events');
```

### Transactions

```javascript
import { transaction } from './config/database.js';

// Using transaction helper
const booking = await transaction(async (client) => {
  // Step 1: Create booking
  const bookingResult = await client.query(
    'INSERT INTO bookings (user_id, event_id, total_amount) VALUES ($1, $2, $3) RETURNING *',
    [userId, eventId, amount]
  );
  
  // Step 2: Create booking items
  await client.query(
    'INSERT INTO booking_items (booking_id, ticket_type_id, quantity) VALUES ($1, $2, $3)',
    [bookingResult.rows[0].id, ticketTypeId, quantity]
  );
  
  // Step 3: Update inventory
  await client.query(
    'UPDATE ticket_inventory SET available_count = available_count - $1 WHERE ticket_type_id = $2',
    [quantity, ticketTypeId]
  );
  
  return bookingResult.rows[0];
});
// Automatically commits on success, rolls back on error
```

### Manual Transaction Control

```javascript
import { beginTransaction, commitTransaction, rollbackTransaction } from './config/database.js';

const client = await beginTransaction();
try {
  // Execute queries
  await client.query('INSERT INTO ...');
  await client.query('UPDATE ...');
  
  await commitTransaction(client);
} catch (error) {
  await rollbackTransaction(client);
  throw error;
}
```

---

## 📊 Database Utilities

### Test Connection

```javascript
import { testConnection, getStats, verifySchema } from './config/database.js';

// Check if database is reachable
const isConnected = await testConnection();

// Get database statistics
const stats = await getStats();
console.log(stats.tables);      // Number of tables
console.log(stats.connections); // Active connections
console.log(stats.size);        // Database size in bytes
console.log(stats.pool);        // Pool status

// Verify schema is complete
const schema = await verifySchema();
console.log(schema.isComplete); // true/false
console.log(schema.missing);      // Array of missing tables
```

### Query Building Helpers

```javascript
import { buildWhereClause, buildPagination } from './config/database.js';

// Build WHERE clause
const filters = { status: 'published', category_id: 'uuid-here' };
const where = buildWhereClause(filters);
// Returns: { clause: "WHERE status = $1 AND category_id = $2", params: ['published', 'uuid'], nextIndex: 3 }

const result = await query(
  `SELECT * FROM events ${where.clause}`,
  where.params
);

// Build pagination
const pagination = buildPagination({ page: 2, limit: 10 });
// Returns: { clause: "LIMIT $1 OFFSET $2", params: [10, 10], page: 2, limit: 10, offset: 10 }

const result = await query(
  `SELECT * FROM events ${where.clause} ORDER BY created_at DESC ${pagination.clause}`,
  [...where.params, ...pagination.params]
);
```

---

## 🔧 Troubleshooting

### Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Fix:**
1. Check PostgreSQL is running:
   ```powershell
   # Windows
   Get-Service postgresql*
   
   # Start if stopped
   Start-Service postgresql-x64-14
   ```

2. Verify connection string in `.env`:
   ```env
   DATABASE_URL=postgresql://postgres:Mihir1234@localhost:5432/eventify_db
   ```

3. Test with psql:
   ```bash
   psql "postgresql://postgres:Mihir1234@localhost:5432/eventify_db"
   ```

### Authentication Failed

```
Error: password authentication failed for user "postgres"
```

**Fix:**
1. Reset PostgreSQL password in pgAdmin
2. Update `.env` with correct password
3. Or create a new database user:
   ```sql
   CREATE USER eventify WITH PASSWORD 'newpassword';
   CREATE DATABASE eventify_db OWNER eventify;
   ```

### Database Does Not Exist

```
Error: database "eventify_db" does not exist
```

**Fix:**
```bash
# Create database
psql -U postgres -c "CREATE DATABASE eventify_db;"

# Or in pgAdmin
-- Right-click Databases → Create → Database
```

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Fix:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <PID> /F
```

---

## 📝 SQL Quick Reference

### Check Tables
```sql
-- List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check table structure
\d users

-- Count rows
SELECT COUNT(*) FROM users;
```

### Reset Database
```sql
-- Drop all tables (DANGEROUS!)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- Re-run schema
\i backend/database-schema-complete.sql
```

### Common Queries
```sql
-- Find user by email
SELECT * FROM users WHERE email = 'user@example.com';

-- Check bookings
SELECT * FROM bookings WHERE user_id = 'uuid-here';

-- Event stats
SELECT 
  e.title,
  COUNT(b.id) as bookings,
  SUM(b.total_amount) as revenue
FROM events e
LEFT JOIN bookings b ON e.id = b.event_id
GROUP BY e.id;
```

---

## 🔐 Security Best Practices

### Environment Variables
- Never commit `.env` to git
- Use strong JWT_SECRET (min 32 chars)
- Rotate database passwords regularly
- Use different credentials for production

### Database Security
```javascript
// ✅ Use parameterized queries (prevents SQL injection)
await query('SELECT * FROM users WHERE id = $1', [userId]);

// ❌ Never do this!
await query(`SELECT * FROM users WHERE id = '${userId}'`);
```

### Connection Pooling
```javascript
// Pool automatically manages connections
// Default: max 20, min 5 connections
// Adjust in database.js if needed
```

---

## 📈 Performance Tips

### 1. Use Indexes
Schema already includes indexes on commonly queried columns.

### 2. Connection Pooling
The pool maintains persistent connections - don't create new pools.

### 3. Batch Queries
```javascript
// Instead of multiple queries
const users = await query('SELECT * FROM users WHERE id = ANY($1)', [userIds]);

// Instead of
for (const id of userIds) {
  await query('SELECT * FROM users WHERE id = $1', [id]);
}
```

### 4. Use Transactions
Wrap related operations in transactions for consistency.

---

## 🎯 Next Steps

1. ✅ Run database initialization
2. ✅ Test connection
3. ✅ Start backend server
4. ✅ Start frontend development
5. 🔄 Begin building features!

---

## 🆘 Support

If issues persist:

1. Check logs: `backend/logs/` (if configured)
2. Run test script: `node scripts/test-database.js`
3. Verify PostgreSQL: `psql --version`
4. Check pgAdmin connection status

**Connection String Format:**
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE
postgresql://postgres:Mihir1234@localhost:5432/eventify_db
```

---

**Ready to build! 🚀**
