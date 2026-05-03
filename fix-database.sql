-- FIX DATABASE FOR BOOKINGS
-- Run this in your PostgreSQL database

-- 1. Check if events exist
SELECT id, title, pg_typeof(id) as id_type FROM events LIMIT 2;

-- 2. If no events exist, create sample event with UUID
-- Using a fixed UUID so frontend can reference it
INSERT INTO events (id, title, description, start_at, end_at, base_price, status, created_at, updated_at)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'Tech Conference 2026',
  'Join the most anticipated technology summit of 2026. Connect with industry leaders, discover cutting-edge innovations, and network with thousands of tech professionals from around the world.',
  '2026-03-15 09:00:00',
  '2026-03-17 18:00:00',
  99.00,
  'published',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 3. Create venue with UUID
INSERT INTO venues (id, name, city, state, country, capacity, created_at)
VALUES ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::uuid, 'Marwadi University', 'Rajkot', 'Gujarat', 'India', 5000, NOW())
ON CONFLICT (id) DO NOTHING;

-- 4. Update event with venue UUID
UPDATE events SET venue_id = 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::uuid 
WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid AND venue_id IS NULL;

-- 5. Create category with UUID
INSERT INTO categories (id, name, description, created_at)
VALUES ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::uuid, 'Technology', 'Technology and IT events', NOW())
ON CONFLICT (id) DO NOTHING;

-- 6. Update event with category UUID
UPDATE events SET category_id = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::uuid 
WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid AND category_id IS NULL;

-- 7. Update event with category UUID
UPDATE events SET category_id = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::uuid 
WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid AND category_id IS NULL;

-- 8. Create ticket types for this event (using UUID event_id)
INSERT INTO ticket_types (id, event_id, name, price, quantity, sold_count, is_early_bird, created_at)
VALUES 
  (gen_random_uuid(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Early Bird', 79.00, 100, 0, true, NOW()),
  (gen_random_uuid(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'Regular', 99.00, 200, 0, false, NOW()),
  (gen_random_uuid(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'VIP', 199.00, 50, 0, false, NOW())
ON CONFLICT DO NOTHING;

-- 9. Verify everything was created
SELECT e.id, e.title, e.venue_id, e.category_id, e.base_price, 
       v.name as venue_name, c.name as category_name
FROM events e
LEFT JOIN venues v ON v.id = e.venue_id
LEFT JOIN categories c ON c.id = e.category_id
WHERE e.id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid;

-- 10. Verify ticket types
SELECT id, name, price, quantity, event_id 
FROM ticket_types 
WHERE event_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid;
