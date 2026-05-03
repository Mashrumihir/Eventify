-- DIAGNOSE DATABASE ISSUES
-- Run these queries in your PostgreSQL database

-- 1. Check your user ID format
SELECT id, full_name, email, pg_typeof(id) as id_type 
FROM users 
WHERE email = 'mashrumihir15@gmail.com';

-- 2. Check if events exist
SELECT id, title, pg_typeof(id) as id_type 
FROM events 
LIMIT 3;

-- 3. Check ticket types
SELECT id, name, price, event_id, pg_typeof(id) as id_type 
FROM ticket_types 
LIMIT 3;

-- 4. Check if any events have ticket types
SELECT e.id as event_id, e.title, tt.id as ticket_id, tt.name, tt.price
FROM events e
LEFT JOIN ticket_types tt ON tt.event_id = e.id
LIMIT 5;

-- 5. Check bookings table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bookings';
