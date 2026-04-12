-- Eventify CRUD queries for PostgreSQL
-- Use with docs/postgres-schema.sql

BEGIN;

-- =========================================================
-- 1. USERS / AUTH
-- =========================================================

-- Create user
INSERT INTO users (
  full_name,
  email,
  password_hash,
  role,
  status,
  phone
) VALUES (
  'Mihir Mashru',
  'mihir@example.com',
  '$2b$10$replace_with_real_bcrypt_hash',
  'attendee',
  'active',
  '+91-9876543210'
)
RETURNING *;

-- Create profile
INSERT INTO user_profiles (
  user_id,
  city,
  state,
  country,
  is_email_notifications_enabled,
  is_push_notifications_enabled,
  is_event_reminders_enabled,
  is_promotional_notifications_enabled
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Rajkot',
  'Gujarat',
  'India',
  TRUE,
  TRUE,
  TRUE,
  FALSE
)
RETURNING *;

-- Read user by email
SELECT *
FROM users
WHERE email = 'mihir@example.com';

-- Read full user profile
SELECT
  u.id,
  u.full_name,
  u.email,
  u.role,
  u.status,
  u.email_verified_at,
  p.city,
  p.state,
  p.country,
  p.company_name,
  p.website_url
FROM users u
LEFT JOIN user_profiles p ON p.user_id = u.id
WHERE u.id = '00000000-0000-0000-0000-000000000001';

-- Update user
UPDATE users
SET
  full_name = 'Mihir M.',
  phone = '+91-9999999999',
  updated_at = NOW()
WHERE id = '00000000-0000-0000-0000-000000000001'
RETURNING *;

-- Update notification preferences
UPDATE user_profiles
SET
  is_email_notifications_enabled = TRUE,
  is_push_notifications_enabled = TRUE,
  is_event_reminders_enabled = TRUE,
  is_promotional_notifications_enabled = TRUE,
  updated_at = NOW()
WHERE user_id = '00000000-0000-0000-0000-000000000001'
RETURNING *;

-- Block user
UPDATE users
SET
  status = 'blocked',
  updated_at = NOW()
WHERE id = '00000000-0000-0000-0000-000000000001'
RETURNING *;

-- Delete user
DELETE FROM users
WHERE id = '00000000-0000-0000-0000-000000000001';

-- Create email verification token
INSERT INTO email_verification_tokens (user_id, token, expires_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '123456',
  NOW() + INTERVAL '15 minutes'
)
RETURNING *;

-- Verify email
UPDATE users
SET
  email_verified_at = NOW(),
  updated_at = NOW()
WHERE id = '00000000-0000-0000-0000-000000000001'
RETURNING *;

UPDATE email_verification_tokens
SET consumed_at = NOW()
WHERE user_id = '00000000-0000-0000-0000-000000000001'
  AND token = '123456'
  AND consumed_at IS NULL
RETURNING *;

-- Create password reset token
INSERT INTO password_reset_tokens (user_id, token, expires_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '654321',
  NOW() + INTERVAL '15 minutes'
)
RETURNING *;

-- Reset password
UPDATE users
SET
  password_hash = '$2b$10$replace_with_new_bcrypt_hash',
  updated_at = NOW()
WHERE id = '00000000-0000-0000-0000-000000000001'
RETURNING *;

UPDATE password_reset_tokens
SET consumed_at = NOW()
WHERE user_id = '00000000-0000-0000-0000-000000000001'
  AND token = '654321'
  AND consumed_at IS NULL
RETURNING *;

-- =========================================================
-- 2. ORGANIZER APPLICATIONS
-- =========================================================

-- Submit organizer application
INSERT INTO organizer_applications (
  user_id,
  organization_name,
  business_type,
  contact_email,
  contact_phone,
  website_url,
  business_address,
  description,
  submitted_documents
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'Eventify Labs',
  'Private Company',
  'organizer@example.com',
  '+91-8888888888',
  'https://example.com',
  'Rajkot, Gujarat',
  'We organize technology and music events.',
  '["gst_certificate.pdf","company_pan.pdf"]'::jsonb
)
RETURNING *;

-- List pending applications
SELECT
  oa.*,
  u.full_name,
  u.email
FROM organizer_applications oa
JOIN users u ON u.id = oa.user_id
WHERE oa.status = 'pending'
ORDER BY oa.created_at DESC;

-- Approve organizer application
UPDATE organizer_applications
SET
  status = 'approved',
  admin_notes = 'Approved after document review.',
  reviewed_by = '00000000-0000-0000-0000-000000000999',
  reviewed_at = NOW(),
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000001'
RETURNING *;

UPDATE users
SET
  role = 'organizer',
  status = 'active',
  updated_at = NOW()
WHERE id = '00000000-0000-0000-0000-000000000002'
RETURNING *;

-- Reject organizer application
UPDATE organizer_applications
SET
  status = 'rejected',
  admin_notes = 'Documents are incomplete.',
  reviewed_by = '00000000-0000-0000-0000-000000000999',
  reviewed_at = NOW(),
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000002'
RETURNING *;

-- =========================================================
-- 3. CATEGORIES / VENUES
-- =========================================================

-- Create category
INSERT INTO categories (name, slug, description, icon_name)
VALUES ('Sports', 'sports', 'Sports and fitness events', 'trophy')
RETURNING *;

-- Read all active categories
SELECT *
FROM categories
WHERE is_active = TRUE
ORDER BY name;

-- Update category
UPDATE categories
SET
  description = 'Sports tournaments, matches, and fitness events',
  updated_at = NOW()
WHERE slug = 'sports'
RETURNING *;

-- Delete category
DELETE FROM categories
WHERE slug = 'sports';

-- Create venue
INSERT INTO venues (
  name,
  address_line_1,
  city,
  state,
  country,
  postal_code,
  latitude,
  longitude
) VALUES (
  'Marvadi University Auditorium',
  'Morbi Road',
  'Rajkot',
  'Gujarat',
  'India',
  '360003',
  22.3039000,
  70.8022000
)
RETURNING *;

-- Read venue
SELECT *
FROM venues
WHERE id = '20000000-0000-0000-0000-000000000001';

-- Update venue
UPDATE venues
SET
  address_line_2 = 'Near Main Gate',
  updated_at = NOW()
WHERE id = '20000000-0000-0000-0000-000000000001'
RETURNING *;

-- Delete venue
DELETE FROM venues
WHERE id = '20000000-0000-0000-0000-000000000001';

-- =========================================================
-- 4. EVENTS
-- =========================================================

-- Create event
INSERT INTO events (
  organizer_id,
  category_id,
  venue_id,
  title,
  slug,
  short_description,
  description,
  cover_image_url,
  start_at,
  end_at,
  timezone,
  status,
  capacity,
  refund_policy,
  is_published
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  '30000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000001',
  'Tech Summit 2026',
  'tech-summit-2026',
  'A summit for developers, founders, and creators.',
  'Full day event with keynotes, workshops, and networking.',
  'https://images.example.com/events/tech-summit-2026.jpg',
  '2026-06-20 09:00:00+05:30',
  '2026-06-20 18:00:00+05:30',
  'Asia/Kolkata',
  'upcoming',
  500,
  'Refund allowed up to 48 hours before event start.',
  TRUE
)
RETURNING *;

-- List public upcoming events
SELECT
  e.id,
  e.title,
  e.slug,
  e.short_description,
  e.start_at,
  e.end_at,
  e.status,
  e.average_rating,
  e.ratings_count,
  c.name AS category_name,
  v.name AS venue_name,
  v.city,
  u.full_name AS organizer_name
FROM events e
LEFT JOIN categories c ON c.id = e.category_id
LEFT JOIN venues v ON v.id = e.venue_id
JOIN users u ON u.id = e.organizer_id
WHERE e.is_published = TRUE
  AND e.status IN ('published', 'upcoming', 'ongoing')
ORDER BY e.start_at ASC;

-- Read event details
SELECT
  e.*,
  c.name AS category_name,
  v.name AS venue_name,
  v.city,
  v.state,
  u.full_name AS organizer_name,
  u.email AS organizer_email
FROM events e
LEFT JOIN categories c ON c.id = e.category_id
LEFT JOIN venues v ON v.id = e.venue_id
JOIN users u ON u.id = e.organizer_id
WHERE e.id = '40000000-0000-0000-0000-000000000001';

-- Read organizer events
SELECT *
FROM events
WHERE organizer_id = '00000000-0000-0000-0000-000000000002'
ORDER BY created_at DESC;

-- Search events
SELECT *
FROM events
WHERE title ILIKE '%tech%'
   OR short_description ILIKE '%tech%'
ORDER BY start_at ASC;

-- Update event
UPDATE events
SET
  title = 'Tech Summit 2026 - Updated',
  short_description = 'Updated summit overview.',
  capacity = 650,
  updated_at = NOW()
WHERE id = '40000000-0000-0000-0000-000000000001'
RETURNING *;

-- Cancel event
UPDATE events
SET
  status = 'cancelled',
  updated_at = NOW()
WHERE id = '40000000-0000-0000-0000-000000000001'
RETURNING *;

-- Delete event
DELETE FROM events
WHERE id = '40000000-0000-0000-0000-000000000001';

-- =========================================================
-- 5. TICKET TYPES
-- =========================================================

-- Create ticket type
INSERT INTO ticket_types (
  event_id,
  name,
  description,
  price,
  quantity_total,
  sale_start_at,
  sale_end_at
) VALUES (
  '40000000-0000-0000-0000-000000000001',
  'VIP Pass',
  'Front-row seating and priority access',
  1999.00,
  100,
  NOW(),
  NOW() + INTERVAL '30 days'
)
RETURNING *;

-- Read ticket types for event
SELECT *
FROM ticket_types
WHERE event_id = '40000000-0000-0000-0000-000000000001'
ORDER BY price ASC;

-- Update ticket type
UPDATE ticket_types
SET
  price = 2499.00,
  quantity_total = 150,
  updated_at = NOW()
WHERE id = '50000000-0000-0000-0000-000000000001'
RETURNING *;

-- Delete ticket type
DELETE FROM ticket_types
WHERE id = '50000000-0000-0000-0000-000000000001';

-- =========================================================
-- 6. BOOKINGS
-- =========================================================

-- Create booking
INSERT INTO bookings (
  booking_code,
  user_id,
  event_id,
  status,
  subtotal_amount,
  discount_amount,
  tax_amount,
  total_amount,
  currency,
  qr_code
) VALUES (
  'BK-2026-0001',
  '00000000-0000-0000-0000-000000000001',
  '40000000-0000-0000-0000-000000000001',
  'confirmed',
  1999.00,
  0.00,
  359.82,
  2358.82,
  'INR',
  'QR-CODE-DATA-EXAMPLE'
)
RETURNING *;

-- Create booking item
INSERT INTO booking_items (
  booking_id,
  ticket_type_id,
  quantity,
  unit_price,
  line_total,
  attendee_name,
  attendee_email
) VALUES (
  '60000000-0000-0000-0000-000000000001',
  '50000000-0000-0000-0000-000000000001',
  1,
  1999.00,
  1999.00,
  'Mihir Mashru',
  'mihir@example.com'
)
RETURNING *;

-- Read booking with items
SELECT
  b.*,
  e.title AS event_title,
  e.start_at,
  e.end_at,
  tt.name AS ticket_name,
  bi.quantity,
  bi.unit_price,
  bi.line_total
FROM bookings b
JOIN events e ON e.id = b.event_id
LEFT JOIN booking_items bi ON bi.booking_id = b.id
LEFT JOIN ticket_types tt ON tt.id = bi.ticket_type_id
WHERE b.id = '60000000-0000-0000-0000-000000000001';

-- Read attendee bookings
SELECT
  b.id,
  b.booking_code,
  b.status,
  b.total_amount,
  b.booked_at,
  e.title,
  e.start_at,
  v.city
FROM bookings b
JOIN events e ON e.id = b.event_id
LEFT JOIN venues v ON v.id = e.venue_id
WHERE b.user_id = '00000000-0000-0000-0000-000000000001'
ORDER BY b.booked_at DESC;

-- Read organizer bookings
SELECT
  b.id,
  b.booking_code,
  b.status,
  b.total_amount,
  b.booked_at,
  u.full_name AS attendee_name,
  e.title AS event_title
FROM bookings b
JOIN users u ON u.id = b.user_id
JOIN events e ON e.id = b.event_id
WHERE e.organizer_id = '00000000-0000-0000-0000-000000000002'
ORDER BY b.booked_at DESC;

-- Cancel booking
UPDATE bookings
SET
  status = 'cancelled',
  cancelled_at = NOW(),
  cancellation_reason = 'User requested cancellation',
  updated_at = NOW()
WHERE id = '60000000-0000-0000-0000-000000000001'
RETURNING *;

-- Delete booking
DELETE FROM bookings
WHERE id = '60000000-0000-0000-0000-000000000001';

-- =========================================================
-- 7. PAYMENTS
-- =========================================================

-- Create payment
INSERT INTO payments (
  booking_id,
  event_id,
  payer_id,
  gateway_transaction_id,
  gateway_name,
  payment_method,
  payment_status,
  amount,
  currency,
  paid_at
) VALUES (
  '60000000-0000-0000-0000-000000000001',
  '40000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'TXN-10001',
  'Razorpay',
  'upi',
  'success',
  2358.82,
  'INR',
  NOW()
)
RETURNING *;

-- Read payment details
SELECT
  p.*,
  b.booking_code,
  e.title AS event_title,
  u.full_name AS payer_name
FROM payments p
JOIN bookings b ON b.id = p.booking_id
JOIN events e ON e.id = p.event_id
JOIN users u ON u.id = p.payer_id
WHERE p.id = '70000000-0000-0000-0000-000000000001';

-- Organizer payment dashboard
SELECT
  COUNT(*) AS total_transactions,
  COALESCE(SUM(amount), 0) AS gross_revenue,
  COALESCE(SUM(refund_amount), 0) AS refunded_total
FROM payments p
JOIN events e ON e.id = p.event_id
WHERE e.organizer_id = '00000000-0000-0000-0000-000000000002'
  AND p.payment_status IN ('success', 'partially_refunded', 'refunded');

-- Update payment as refunded
UPDATE payments
SET
  payment_status = 'refunded',
  refund_amount = 2358.82,
  refunded_at = NOW(),
  updated_at = NOW()
WHERE id = '70000000-0000-0000-0000-000000000001'
RETURNING *;

-- Delete payment
DELETE FROM payments
WHERE id = '70000000-0000-0000-0000-000000000001';

-- =========================================================
-- 8. WISHLIST
-- =========================================================

-- Add event to wishlist
INSERT INTO wishlists (user_id, event_id)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '40000000-0000-0000-0000-000000000001'
)
RETURNING *;

-- Read wishlist
SELECT
  w.id,
  w.created_at,
  e.id AS event_id,
  e.title,
  e.slug,
  e.cover_image_url,
  e.start_at,
  e.average_rating,
  e.ratings_count
FROM wishlists w
JOIN events e ON e.id = w.event_id
WHERE w.user_id = '00000000-0000-0000-0000-000000000001'
ORDER BY w.created_at DESC;

-- Remove event from wishlist
DELETE FROM wishlists
WHERE user_id = '00000000-0000-0000-0000-000000000001'
  AND event_id = '40000000-0000-0000-0000-000000000001';

-- =========================================================
-- 9. REVIEWS
-- =========================================================

-- Create review
INSERT INTO reviews (
  user_id,
  event_id,
  booking_id,
  rating,
  title,
  review_text,
  status
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  '40000000-0000-0000-0000-000000000001',
  '60000000-0000-0000-0000-000000000001',
  5,
  'Amazing event',
  'Great speakers and very smooth organization.',
  'pending'
)
RETURNING *;

-- Read reviews for event
SELECT
  r.id,
  r.rating,
  r.title,
  r.review_text,
  r.status,
  r.created_at,
  u.full_name
FROM reviews r
JOIN users u ON u.id = r.user_id
WHERE r.event_id = '40000000-0000-0000-0000-000000000001'
ORDER BY r.created_at DESC;

-- Read logged-in user reviews
SELECT
  r.*,
  e.title AS event_title
FROM reviews r
JOIN events e ON e.id = r.event_id
WHERE r.user_id = '00000000-0000-0000-0000-000000000001'
ORDER BY r.created_at DESC;

-- Approve review
UPDATE reviews
SET
  status = 'approved',
  reviewed_by = '00000000-0000-0000-0000-000000000999',
  reviewed_at = NOW(),
  updated_at = NOW()
WHERE id = '80000000-0000-0000-0000-000000000001'
RETURNING *;

-- Report review
UPDATE reviews
SET
  status = 'reported',
  moderation_notes = 'Reported by organizer for abusive language.',
  updated_at = NOW()
WHERE id = '80000000-0000-0000-0000-000000000001'
RETURNING *;

-- Update review text
UPDATE reviews
SET
  rating = 4,
  review_text = 'Updated feedback after follow-up.',
  updated_at = NOW()
WHERE id = '80000000-0000-0000-0000-000000000001'
RETURNING *;

-- Delete review
DELETE FROM reviews
WHERE id = '80000000-0000-0000-0000-000000000001';

-- Recalculate event rating
UPDATE events e
SET
  average_rating = COALESCE(stats.avg_rating, 0),
  ratings_count = COALESCE(stats.total_reviews, 0),
  updated_at = NOW()
FROM (
  SELECT
    event_id,
    ROUND(AVG(rating)::numeric, 2) AS avg_rating,
    COUNT(*) AS total_reviews
  FROM reviews
  WHERE status = 'approved'
  GROUP BY event_id
) stats
WHERE e.id = stats.event_id
  AND e.id = '40000000-0000-0000-0000-000000000001'
RETURNING e.*;

-- =========================================================
-- 10. ANNOUNCEMENTS
-- =========================================================

-- Create announcement
INSERT INTO announcements (
  event_id,
  organizer_id,
  title,
  message,
  is_published,
  published_at
) VALUES (
  '40000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  'Venue gate opens early',
  'Please arrive 30 minutes before the event starts.',
  TRUE,
  NOW()
)
RETURNING *;

-- Read event announcements
SELECT *
FROM announcements
WHERE event_id = '40000000-0000-0000-0000-000000000001'
ORDER BY created_at DESC;

-- Update announcement
UPDATE announcements
SET
  message = 'Please arrive 45 minutes before the event starts.',
  updated_at = NOW()
WHERE id = '90000000-0000-0000-0000-000000000001'
RETURNING *;

-- Delete announcement
DELETE FROM announcements
WHERE id = '90000000-0000-0000-0000-000000000001';

-- =========================================================
-- 11. NOTIFICATIONS
-- =========================================================

-- Create notification
INSERT INTO notifications (
  user_id,
  event_id,
  booking_id,
  announcement_id,
  type,
  title,
  content
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  '40000000-0000-0000-0000-000000000001',
  '60000000-0000-0000-0000-000000000001',
  NULL,
  'booking',
  'Booking Confirmed',
  'Your booking has been confirmed successfully.'
)
RETURNING *;

-- Read user notifications
SELECT *
FROM notifications
WHERE user_id = '00000000-0000-0000-0000-000000000001'
ORDER BY created_at DESC;

-- Mark one notification as read
UPDATE notifications
SET
  is_read = TRUE,
  read_at = NOW()
WHERE id = '91000000-0000-0000-0000-000000000001'
RETURNING *;

-- Mark all notifications as read
UPDATE notifications
SET
  is_read = TRUE,
  read_at = NOW()
WHERE user_id = '00000000-0000-0000-0000-000000000001'
  AND is_read = FALSE
RETURNING *;

-- Delete notification
DELETE FROM notifications
WHERE id = '91000000-0000-0000-0000-000000000001';

-- =========================================================
-- 12. CMS PAGES
-- =========================================================

-- Create CMS page
INSERT INTO cms_pages (slug, title, content, is_published)
VALUES (
  'contact',
  'Contact Us',
  '{"sections":[{"heading":"Support","body":"Email us at support@example.com"}]}'::jsonb,
  TRUE
)
RETURNING *;

-- Read CMS pages
SELECT *
FROM cms_pages
ORDER BY title;

-- Read one CMS page
SELECT *
FROM cms_pages
WHERE slug = 'about';

-- Update CMS page
UPDATE cms_pages
SET
  content = '{"sections":[{"heading":"About Eventify","body":"Updated content here."}]}'::jsonb,
  updated_at = NOW()
WHERE slug = 'about'
RETURNING *;

-- Delete CMS page
DELETE FROM cms_pages
WHERE slug = 'contact';

-- =========================================================
-- 13. PLATFORM SETTINGS
-- =========================================================

-- Create setting
INSERT INTO platform_settings (setting_key, setting_value, description)
VALUES (
  'support_email',
  '"support@eventify.com"'::jsonb,
  'Default support email'
)
RETURNING *;

-- Read settings
SELECT *
FROM platform_settings
ORDER BY setting_key;

-- Read one setting
SELECT *
FROM platform_settings
WHERE setting_key = 'commission_rate';

-- Update setting
UPDATE platform_settings
SET
  setting_value = '{"percent":18}'::jsonb,
  updated_at = NOW()
WHERE setting_key = 'commission_rate'
RETURNING *;

-- Delete setting
DELETE FROM platform_settings
WHERE setting_key = 'support_email';

COMMIT;
