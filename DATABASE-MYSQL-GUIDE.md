# Eventify MySQL Database Guide
## Complete MySQL Setup & Migration from PostgreSQL

---

## 📁 Files Created

| File | Purpose |
|------|---------|
| `backend/database-schema-mysql.sql` | **Complete MySQL schema** - All tables, enums, indexes |
| `backend/src/config/database-mysql.js` | **MySQL connection module** - Pool, queries, transactions |

---

## 🚀 MySQL Setup (5 Steps)

### Step 1: Install MySQL

```bash
# Windows (using installer)
# Download from: https://dev.mysql.com/downloads/installer/

# Or using XAMPP/WAMP (includes MySQL)

# Mac
brew install mysql

# Ubuntu/Debian
sudo apt-get install mysql-server
```

### Step 2: Create Database

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE eventify_db 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

# Create user (recommended)
CREATE USER 'eventify'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON eventify_db.* TO 'eventify'@'localhost';
FLUSH PRIVILEGES;

EXIT;
```

### Step 3: Run Schema

```bash
# Using command line
cd backend
mysql -u eventify -p eventify_db < database-schema-mysql.sql

# Or in MySQL Workbench
# File → Open SQL Script → Select database-schema-mysql.sql
# Click Execute (lightning bolt icon)
```

### Step 4: Configure Environment

Update `.env` file:

```env
# ============================================
# MySQL Configuration (Comment out PostgreSQL)
# ============================================

# DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=eventify_db
DB_USER=eventify
DB_PASSWORD=your_password

# Comment out PostgreSQL
# DATABASE_URL=postgresql://...
```

### Step 5: Update Backend Code

In your controllers, switch imports:

```javascript
// FROM PostgreSQL:
import { query, transaction } from '../config/database.js';

// TO MySQL:
import { query, transaction, Enums } from '../config/database-mysql.js';
```

---

## 🔀 PostgreSQL vs MySQL Differences

| Feature | PostgreSQL | MySQL |
|---------|-----------|-------|
| **UUID Generation** | `gen_random_uuid()` | `UUID()` function |
| **ENUM Types** | Native `CREATE TYPE` | Reference tables |
| **JSON** | `JSONB` (binary) | `JSON` (text) |
| **Timestamps** | `TIMESTAMPTZ` | `TIMESTAMP` |
| **Case Sensitivity** | Preserved | Table names case-sensitive on Linux |
| **Text Search** | Full-text built-in | Requires configuration |

---

## 📝 Key SQL Differences

### 1. UUID Generation

**PostgreSQL:**
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
```

**MySQL:**
```sql
id CHAR(36) PRIMARY KEY DEFAULT (UUID())
```

### 2. ENUM Types

**PostgreSQL:**
```sql
CREATE TYPE user_role AS ENUM ('attendee', 'organizer', 'admin');
```

**MySQL:**
```sql
-- Create reference table
CREATE TABLE enum_user_role (
  id INT PRIMARY KEY AUTO_INCREMENT,
  role_name VARCHAR(20) NOT NULL UNIQUE
);
INSERT INTO enum_user_role (role_name) VALUES ('attendee'), ('organizer'), ('admin');

-- Use foreign key in main table
role_id INT DEFAULT 1,
FOREIGN KEY (role_id) REFERENCES enum_user_role(id)
```

### 3. JSON Data

**PostgreSQL:**
```sql
facilities JSONB
SELECT facilities->>'wifi' FROM venues;
```

**MySQL:**
```sql
facilities JSON
SELECT JSON_UNQUOTE(JSON_EXTRACT(facilities, '$.wifi')) FROM venues;
-- Or shorthand:
SELECT facilities->>'$.wifi' FROM venues;
```

### 4. Timestamps

**PostgreSQL:**
```sql
created_at TIMESTAMPTZ DEFAULT NOW()
```

**MySQL:**
```sql
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### 5. Auto-Update Timestamps

**PostgreSQL:** (Using triggers)
```sql
CREATE TRIGGER update_timestamp BEFORE UPDATE...
```

**MySQL:** (Built-in)
```sql
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

---

## 🔧 Fixing Common Errors

### Error: "slug cannot be null"

**Problem:** When creating an event, category slug is missing.

**Fix 1 - Database Level (Add trigger to auto-generate slug):**
```sql
-- MySQL: Add BEFORE INSERT trigger
DELIMITER //
CREATE TRIGGER before_insert_categories 
BEFORE INSERT ON categories
FOR EACH ROW
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    SET NEW.slug = LOWER(REPLACE(NEW.name, ' ', '-'));
  END IF;
END//
DELIMITER ;
```

**Fix 2 - Application Level (Backend):**
```javascript
// In your createEvent or createCategory controller
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Before inserting
const slug = generateSlug(categoryName);
```

**Fix 3 - Frontend (React):**
```javascript
// In your form component
const handleCreateCategory = async (name) => {
  const slug = name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  
  await api.post('/categories', { name, slug });
};
```

---

## 🔄 Migration: PostgreSQL to MySQL

### Option 1: Manual Export/Import

```bash
# 1. Export from PostgreSQL
pg_dump -h localhost -U postgres -d eventify_db --data-only > backup.sql

# 2. Transform (use script or manual find/replace)
# - Replace UUID generation
# - Replace JSONB with JSON
# - Replace ENUMs with integers

# 3. Import to MySQL
mysql -u root -p eventify_db < transformed.sql
```

### Option 2: Using Migration Tool

```javascript
// migration-script.js
import pg from './config/database.js'; // PostgreSQL
import mysql from './config/database-mysql.js'; // MySQL

async function migrate() {
  // Get all users from PostgreSQL
  const users = await pg.query('SELECT * FROM users');
  
  // Insert into MySQL
  for (const user of users.rows) {
    await mysql.query(
      'INSERT INTO users (id, email, password_hash, full_name, ...) VALUES (?, ?, ?, ?, ...)',
      [user.id, user.email, user.password_hash, user.full_name]
    );
  }
  
  console.log('Migration complete!');
}

migrate();
```

---

## 🎯 Which Database to Choose?

### Choose PostgreSQL if:
- Complex queries with JSON operations
- Full-text search needed
- Geographic data (PostGIS)
- Complex transactions
- Advanced data types

### Choose MySQL if:
- Simpler hosting/shared hosting
- LAMP stack environment
- Existing MySQL expertise
- Read-heavy workloads
- Cost-effective hosting

---

## 📊 Performance Comparison

| Operation | PostgreSQL | MySQL |
|-----------|-----------|-------|
| Complex JOINs | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| JSON Operations | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Simple Reads | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Write Speed | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Concurrency | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 🆘 Troubleshooting

### MySQL Won't Start
```bash
# Check status
sudo systemctl status mysql

# Check logs
sudo tail -f /var/log/mysql/error.log

# Reset root password if needed
sudo mysql_secure_installation
```

### Connection Refused
```bash
# Check if MySQL is running
sudo netstat -tlnp | grep mysql

# Check bind-address in my.cnf
sudo nano /etc/mysql/my.cnf
# Change: bind-address = 0.0.0.0 (for remote) or 127.0.0.1 (local only)
```

### Character Set Issues
```sql
-- Check current charset
SHOW VARIABLES LIKE 'character_set%';

-- Fix in my.cnf
[mysqld]
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci
```

---

## ✅ Quick Test

```bash
# 1. Test MySQL connection
node -e "
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: 'localhost',
  user: 'eventify',
  password: 'your_password',
  database: 'eventify_db'
});
pool.query('SELECT NOW()').then(r => console.log('✅ Connected:', r[0][0]));
"

# 2. Check tables
mysql -u eventify -p -e "SHOW TABLES;" eventify_db

# 3. Check sample data
mysql -u eventify -p -e "SELECT * FROM categories;" eventify_db
```

---

## 🚀 Next Steps

1. ✅ Run MySQL schema: `mysql -u root -p eventify_db < database-schema-mysql.sql`
2. ✅ Update `.env` with MySQL credentials
3. ✅ Switch imports in controllers (database → database-mysql)
4. ✅ Test: `node scripts/test-mysql.js`
5. ✅ Start development!

---

## 📚 Resources

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [MySQL vs PostgreSQL](https://www.postgresql.org/about/)
- [Node.js MySQL2](https://github.com/sidorares/node-mysql2)

**Both schemas are now ready! Choose what works best for your project! 🎉**
