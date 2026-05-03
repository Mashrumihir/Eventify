-- ============================================================================
-- EVENTIFY - COMPLETE INSERT STATEMENTS FOR ALL TABLES
-- Run this after creating tables to populate with sample data
-- ============================================================================

-- ============================================================================
-- 1. USER ROLES (Enum Table)
-- ============================================================================
INSERT INTO enum_user_role (role_name, description) VALUES
('attendee', 'Event attendee/user'),
('organizer', 'Event organizer/host'),
('admin', 'System administrator')
ON CONFLICT (role_name) DO NOTHING;

-- ============================================================================
-- 2. USER STATUS (Enum Table)
-- ============================================================================
INSERT INTO enum_user_status (status_name, description) VALUES
('active', 'Active user account'),
('inactive', 'Inactive/suspended'),
('pending', 'Pending verification'),
('banned', 'Banned user')
ON CONFLICT (status_name) DO NOTHING;

-- ============================================================================
-- 3. EVENT STATUS (Enum Table)
-- ============================================================================
INSERT INTO enum_event_status (status_name, description) VALUES
('draft', 'Draft event - not published'),
('published', 'Published and visible'),
('live', 'Currently live'),
('completed', 'Event ended'),
('cancelled', 'Cancelled event'),
('postponed', 'Postponed event')
ON CONFLICT (status_name) DO NOTHING;

-- ============================================================================
-- 4. TICKET TIERS (Enum Table)
-- ============================================================================
INSERT INTO enum_ticket_tier (tier_name, description) VALUES
('free', 'Free ticket'),
('early_bird', 'Early bird discount'),
('regular', 'Regular price'),
('vip', 'VIP access'),
('vvip', 'Premium VIP'),
('group', 'Group discount')
ON CONFLICT (tier_name) DO NOTHING;

-- ============================================================================
-- 5. PAYMENT METHODS (Enum Table)
-- ============================================================================
INSERT INTO enum_payment_method (method_name, description) VALUES
('card', 'Credit/Debit card'),
('upi', 'UPI payment'),
('netbanking', 'Net banking'),
('wallet', 'Digital wallet'),
('cod', 'Cash on delivery'),
('bank_transfer', 'Bank transfer')
ON CONFLICT (method_name) DO NOTHING;

-- ============================================================================
-- 6. PAYMENT STATUS (Enum Table)
-- ============================================================================
INSERT INTO enum_payment_status (status_name, description) VALUES
('pending', 'Payment pending'),
('success', 'Payment successful'),
('failed', 'Payment failed'),
('refunded', 'Payment refunded'),
('cancelled', 'Payment cancelled')
ON CONFLICT (status_name) DO NOTHING;

-- ============================================================================
-- 7. BOOKING STATUS (Enum Table)
-- ============================================================================
INSERT INTO enum_booking_status (status_name, description) VALUES
('pending', 'Booking pending'),
('confirmed', 'Booking confirmed'),
('cancelled', 'Booking cancelled'),
('completed', 'Event attended')
ON CONFLICT (status_name) DO NOTHING;

-- ============================================================================
-- 8. NOTIFICATION TYPES (Enum Table)
-- ============================================================================
INSERT INTO enum_notification_type (type_name, description) VALUES
('booking_confirmation', 'Booking confirmation'),
('event_reminder', 'Event reminder'),
('payment_success', 'Payment success'),
('payment_failed', 'Payment failed'),
('organizer_approved', 'Organizer approved'),
('organizer_rejected', 'Organizer rejected'),
('new_review', 'New review received'),
('system_announcement', 'System announcement'),
('promotional', 'Promotional offer'),
('security_alert', 'Security alert')
ON CONFLICT (type_name) DO NOTHING;

-- ============================================================================
-- 9. APPLICATION STATUS (Enum Table)
-- ============================================================================
INSERT INTO enum_application_status (status_name, description) VALUES
('pending', 'Application pending review'),
('approved', 'Application approved'),
('rejected', 'Application rejected')
ON CONFLICT (status_name) DO NOTHING;

-- ============================================================================
-- 10. ADMIN USER (Password: Admin@123)
-- ============================================================================
INSERT INTO users (id, email, password_hash, full_name, role_id, status_id, email_verified_at, created_at)
VALUES (
    gen_random_uuid(),
    'admin@eventify.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'System Administrator',
    (SELECT id FROM enum_user_role WHERE role_name = 'admin'),
    (SELECT id FROM enum_user_status WHERE status_name = 'active'),
    NOW(),
    NOW()
)
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- 11. ORGANIZER USERS (Password: Organizer@123)
-- ============================================================================
INSERT INTO users (id, email, password_hash, full_name, phone, role_id, status_id, email_verified_at, created_at) VALUES
(gen_random_uuid(), 'organizer1@eventify.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Tech Events Organizer', '+91-9876543210', 2, 1, NOW(), NOW()),
(gen_random_uuid(), 'organizer2@eventify.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Music Festival Host', '+91-9876543211', 2, 1, NOW(), NOW()),
(gen_random_uuid(), 'organizer3@eventify.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Business Events Pro', '+91-9876543212', 2, 1, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- 12. ATTENDEE USERS (Password: Attendee@123)
-- ============================================================================
INSERT INTO users (id, email, password_hash, full_name, phone, role_id, status_id, email_verified_at, created_at) VALUES
(gen_random_uuid(), 'mihir@eventify.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mihir Mashru', '+91-9876543213', 1, 1, NOW(), NOW()),
(gen_random_uuid(), 'attendee1@eventify.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John Doe', '+91-9876543214', 1, 1, NOW(), NOW()),
(gen_random_uuid(), 'attendee2@eventify.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane Smith', '+91-9876543215', 1, 1, NOW(), NOW()),
(gen_random_uuid(), 'attendee3@eventify.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Rahul Patel', '+91-9876543216', 1, 1, NOW(), NOW()),
(gen_random_uuid(), 'attendee4@eventify.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Priya Sharma', '+91-9876543217', 1, 1, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- 13. USER PROFILES
-- ============================================================================
INSERT INTO user_profiles (id, user_id, address, city, state, country, postal_code, language, currency, timezone, newsletter_subscribed, company_name, job_title, bio)
SELECT gen_random_uuid(), id, '123 Main Street', 'Ahmedabad', 'Gujarat', 'India', '380001', 'en', 'INR', 'Asia/Kolkata', TRUE, 'Eventify Inc', 'Event Enthusiast', 'Love attending tech and music events'
FROM users WHERE email = 'mihir@eventify.com'
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================================
-- 14. ORGANIZER PROFILES
-- ============================================================================
INSERT INTO organizer_profiles (
    id, user_id, company_name, company_description, industry, 
    business_email, business_phone, address, city, state, country,
    website_url, linkedin_url, is_verified, verified_at, total_events,
    bank_account_name, bank_account_number, bank_ifsc_code
)
SELECT 
    gen_random_uuid(),
    id,
    'TechEvents Pro',
    'Professional technology event management company',
    'Technology',
    'contact@techevents.com',
    '+91-9876543210',
    '456 Business Park',
    'Ahmedabad',
    'Gujarat',
    'India',
    'https://techevents.com',
    'https://linkedin.com/company/techevents',
    TRUE,
    NOW(),
    5,
    'TechEvents Pro',
    '12345678901',
    'HDFC0001234'
FROM users WHERE email = 'organizer1@eventify.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO organizer_profiles (
    id, user_id, company_name, company_description, industry, 
    business_email, business_phone, address, city, state, country,
    website_url, is_verified, verified_at, total_events
)
SELECT 
    gen_random_uuid(),
    id,
    'MusicFiesta',
    'Premier music festival organizers',
    'Entertainment',
    'info@musicfiesta.com',
    '+91-9876543211',
    '789 Entertainment Hub',
    'Mumbai',
    'Maharashtra',
    'India',
    'https://musicfiesta.com',
    TRUE,
    NOW(),
    3
FROM users WHERE email = 'organizer2@eventify.com'
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================================
-- 15. CATEGORIES
-- ============================================================================
INSERT INTO categories (id, name, slug, description, color, is_active, sort_order, created_at) VALUES
(gen_random_uuid(), 'Technology', 'technology', 'Tech events, conferences, and workshops', '#3B82F6', TRUE, 1, NOW()),
(gen_random_uuid(), 'Business', 'business', 'Business networking and seminars', '#10B981', TRUE, 2, NOW()),
(gen_random_uuid(), 'Music', 'music', 'Concerts and music festivals', '#F59E0B', TRUE, 3, NOW()),
(gen_random_uuid(), 'Sports', 'sports', 'Sports events and tournaments', '#EF4444', TRUE, 4, NOW()),
(gen_random_uuid(), 'Food & Drink', 'food-drink', 'Food festivals and tastings', '#8B5CF6', TRUE, 5, NOW()),
(gen_random_uuid(), 'Arts & Culture', 'arts-culture', 'Art exhibitions and cultural events', '#EC4899', TRUE, 6, NOW()),
(gen_random_uuid(), 'Health & Wellness', 'health-wellness', 'Health and wellness workshops', '#14B8A6', TRUE, 7, NOW()),
(gen_random_uuid(), 'Education', 'education', 'Educational workshops and seminars', '#6366F1', TRUE, 8, NOW())
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 16. VENUES
-- ============================================================================
INSERT INTO venues (id, managed_by, name, description, address, city, state, country, postal_code, max_capacity, facilities, contact_phone, contact_email, is_active, verified_at, created_at)
SELECT 
    gen_random_uuid(),
    u.id,
    'Tech Convention Center',
    'State-of-the-art convention center with modern facilities',
    '123 Tech Park Road, SG Highway',
    'Ahmedabad',
    'Gujarat',
    'India',
    '380051',
    500,
    '{"wifi": true, "parking": true, "ac": true, "projector": true, "catering": true}'::jsonb,
    '+91-79-12345678',
    'venue@techconvention.com',
    TRUE,
    NOW(),
    NOW()
FROM users u WHERE u.email = 'organizer1@eventify.com'
ON CONFLICT DO NOTHING;

INSERT INTO venues (id, managed_by, name, description, address, city, state, country, postal_code, max_capacity, facilities, contact_phone, is_active, created_at)
SELECT 
    gen_random_uuid(),
    u.id,
    'Music Arena Mumbai',
    'Large outdoor arena perfect for music festivals',
    '456 Bandra West',
    'Mumbai',
    'Maharashtra',
    'India',
    '400050',
    2000,
    '{"stage": true, "sound_system": true, "lighting": true, "parking": true}'::jsonb,
    '+91-22-87654321',
    TRUE,
    NOW()
FROM users u WHERE u.email = 'organizer2@eventify.com'
ON CONFLICT DO NOTHING;

INSERT INTO venues (id, name, description, address, city, state, country, max_capacity, facilities, is_active, created_at)
VALUES 
(gen_random_uuid(), 'Online Virtual Event', 'Virtual event platform for online events', 'Online', 'Global', 'Global', 'Global', '10000', '{"zoom": true, "streaming": true, "recording": true}'::jsonb, TRUE, NOW()),
(gen_random_uuid(), 'Business Hub Delhi', 'Premium business conference center', '789 Connaught Place', 'New Delhi', 'Delhi', 'India', '300', '{"wifi": true, "projector": true, "video_conference": true, "catering": true}'::jsonb, TRUE, NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 17. EVENTS (Published Events)
-- ============================================================================
INSERT INTO events (
    id, organizer_id, category_id, venue_id, title, slug, description, short_description,
    start_at, end_at, status_id, banner_url, base_price, currency, max_attendees, total_bookings,
    is_featured, is_private, refund_policy, published_at, created_at
)
SELECT 
    gen_random_uuid(),
    o.id,
    c.id,
    v.id,
    'Tech Summit 2025',
    'tech-summit-2025',
    'Join us for the biggest technology summit of the year. Learn about AI, ML, Blockchain, and more from industry experts.',
    'Biggest tech summit with AI, ML, Blockchain experts',
    NOW() + INTERVAL '7 days',
    NOW() + INTERVAL '8 days',
    2, -- published
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200',
    999.00,
    'INR',
    500,
    150,
    TRUE,
    FALSE,
    'Full refund available up to 48 hours before the event.',
    NOW(),
    NOW()
FROM users o, categories c, venues v
WHERE o.email = 'organizer1@eventify.com' 
AND c.slug = 'technology'
AND v.name = 'Tech Convention Center'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO events (
    id, organizer_id, category_id, venue_id, title, slug, description, short_description,
    start_at, end_at, status_id, banner_url, base_price, currency, max_attendees, total_bookings,
    is_featured, refund_policy, published_at, created_at
)
SELECT 
    gen_random_uuid(),
    o.id,
    c.id,
    v.id,
    'Music Festival Mumbai',
    'music-festival-mumbai-2025',
    'Experience the ultimate music festival with top artists from across India. Food, fun, and unforgettable memories await!',
    'Ultimate music festival with top Indian artists',
    NOW() + INTERVAL '14 days',
    NOW() + INTERVAL '15 days',
    2,
    'https://images.unsplash.com/photo-1459749411177-047381bb3ece?w=1200',
    1499.00,
    'INR',
    2000,
    800,
    TRUE,
    'No refunds after ticket purchase.',
    NOW(),
    NOW()
FROM users o, categories c, venues v
WHERE o.email = 'organizer2@eventify.com' 
AND c.slug = 'music'
AND v.name = 'Music Arena Mumbai'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO events (
    id, organizer_id, category_id, venue_id, title, slug, description, short_description,
    start_at, end_at, status_id, banner_url, base_price, currency, max_attendees, total_bookings,
    is_featured, refund_policy, published_at, created_at
)
SELECT 
    gen_random_uuid(),
    o.id,
    c.id,
    v.id,
    'Business Leadership Summit',
    'business-leadership-summit',
    'Learn from top business leaders about leadership, management, and entrepreneurship. Network with industry professionals.',
    'Leadership and entrepreneurship networking event',
    NOW() + INTERVAL '21 days',
    NOW() + INTERVAL '22 days',
    2,
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200',
    2499.00,
    'INR',
    300,
    100,
    FALSE,
    '50% refund up to 7 days before event.',
    NOW(),
    NOW()
FROM users o, categories c, venues v
WHERE o.email = 'organizer3@eventify.com' 
AND c.slug = 'business'
AND v.name = 'Business Hub Delhi'
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 18. TICKET TYPES
-- ============================================================================
INSERT INTO ticket_types (id, event_id, name, description, tier_id, price, original_price, quantity_available, quantity_sold, min_per_booking, max_per_booking, is_active)
SELECT 
    gen_random_uuid(),
    e.id,
    'Early Bird',
    'Early bird special price - Limited availability',
    2, -- early_bird
    799.00,
    999.00,
    100,
    50,
    1,
    5,
    TRUE
FROM events e WHERE e.title = 'Tech Summit 2025'
ON CONFLICT DO NOTHING;

INSERT INTO ticket_types (id, event_id, name, description, tier_id, price, quantity_available, quantity_sold, min_per_booking, max_per_booking, is_active)
SELECT 
    gen_random_uuid(),
    e.id,
    'Regular',
    'Regular admission ticket',
    3, -- regular
    999.00,
    400,
    100,
    1,
    10,
    TRUE
FROM events e WHERE e.title = 'Tech Summit 2025'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 19. BOOKINGS
-- ============================================================================
INSERT INTO bookings (id, event_id, user_id, booking_reference, status_id, subtotal, discount_amount, tax_amount, total_amount, created_at)
SELECT 
    gen_random_uuid(),
    e.id,
    u.id,
    'EVT-' || EXTRACT(EPOCH FROM NOW())::INTEGER || '-' || (RANDOM() * 1000)::INTEGER,
    2, -- confirmed
    999.00,
    0.00,
    179.82, -- 18% GST
    1178.82,
    NOW()
FROM events e, users u
WHERE e.title = 'Tech Summit 2025' AND u.email = 'mihir@eventify.com'
ON CONFLICT (booking_reference) DO NOTHING;

-- ============================================================================
-- 20. PAYMENTS
-- ============================================================================
INSERT INTO payments (id, booking_id, payment_reference, amount, currency, status_id, gateway_response, paid_at)
SELECT 
    gen_random_uuid(),
    b.id,
    'PAY-' || EXTRACT(EPOCH FROM NOW())::INTEGER,
    b.total_amount,
    'INR',
    2, -- success
    '{"gateway": "razorpay", "method": "upi"}'::jsonb,
    NOW()
FROM bookings b
WHERE b.booking_reference LIKE 'EVT-%'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 21. WISHLISTS
-- ============================================================================
INSERT INTO wishlists (id, user_id, event_id, created_at)
SELECT 
    gen_random_uuid(),
    u.id,
    e.id,
    NOW()
FROM users u, events e
WHERE u.email = 'mihir@eventify.com' AND e.title = 'Music Festival Mumbai'
ON CONFLICT (user_id, event_id) DO NOTHING;

-- ============================================================================
-- 22. REVIEWS
-- ============================================================================
INSERT INTO reviews (id, event_id, user_id, overall_rating, value_rating, venue_rating, organization_rating, title, content, is_approved, helpful_count, created_at)
SELECT 
    gen_random_uuid(),
    e.id,
    u.id,
    5,
    5,
    5,
    5,
    'Amazing Tech Event!',
    'The Tech Summit was incredibly well organized. Great speakers and networking opportunities. Highly recommend!',
    TRUE,
    12,
    NOW()
FROM events e, users u
WHERE e.title = 'Tech Summit 2025' AND u.email = 'mihir@eventify.com'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 23. NOTIFICATIONS
-- ============================================================================
INSERT INTO notifications (id, user_id, type_id, title, message, is_read, created_at)
SELECT 
    gen_random_uuid(),
    u.id,
    1, -- booking_confirmation
    'Booking Confirmed!',
    'Your booking for Tech Summit 2025 has been confirmed. See you there!',
    FALSE,
    NOW()
FROM users u
WHERE u.email = 'mihir@eventify.com'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 24. SYSTEM SETTINGS
-- ============================================================================
INSERT INTO system_settings (id, settings_key, settings_value, description, data_type) VALUES
(gen_random_uuid(), 'site_name', 'Eventify', 'Website name', 'string'),
(gen_random_uuid(), 'site_logo', '/logo.png', 'Site logo URL', 'string'),
(gen_random_uuid(), 'platform_fee_percent', '2.5', 'Platform fee percentage', 'number'),
(gen_random_uuid(), 'gst_percentage', '18', 'GST percentage', 'number'),
(gen_random_uuid(), 'default_currency', 'INR', 'Default currency code', 'string'),
(gen_random_uuid(), 'enable_user_registration', 'true', 'Allow new user registration', 'boolean'),
(gen_random_uuid(), 'max_login_attempts', '5', 'Max failed login attempts', 'number'),
(gen_random_uuid(), 'support_email', 'admin@eventify.com', 'Support email address', 'string')
ON CONFLICT (settings_key) DO NOTHING;

-- ============================================================================
-- 25. ORGANIZER APPLICATIONS (Sample)
-- ============================================================================
INSERT INTO organizer_applications (
    id, user_id, organization_name, organization_type, registration_number,
    business_email, business_phone, description, status, reviewed_by, reviewed_at
)
SELECT 
    gen_random_uuid(),
    u.id,
    'Food Fiesta Events',
    'Food & Beverage',
    'REG-12345',
    'info@foodfiesta.com',
    '+91-9876543218',
    'We organize food festivals and culinary events across India.',
    'approved',
    admin.id,
    NOW()
FROM users u, users admin
WHERE u.email NOT IN (SELECT email FROM users WHERE role_id = 2) 
AND u.role_id = 1
AND admin.email = 'admin@eventify.com'
LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 26. ACTIVITY LOGS
-- ============================================================================
INSERT INTO activity_logs (id, user_id, action, entity_type, description, ip_address, created_at)
SELECT 
    gen_random_uuid(),
    u.id,
    'login',
    'user',
    'User logged in successfully',
    '192.168.1.1',
    NOW()
FROM users u
WHERE u.email = 'admin@eventify.com'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- VERIFICATION - Check Data Inserted
-- ============================================================================
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL SELECT 'Categories', COUNT(*) FROM categories
UNION ALL SELECT 'Venues', COUNT(*) FROM venues
UNION ALL SELECT 'Events', COUNT(*) FROM events
UNION ALL SELECT 'Bookings', COUNT(*) FROM bookings
UNION ALL SELECT 'Payments', COUNT(*) FROM payments
UNION ALL SELECT 'Reviews', COUNT(*) FROM reviews
UNION ALL SELECT 'Notifications', COUNT(*) FROM notifications;
