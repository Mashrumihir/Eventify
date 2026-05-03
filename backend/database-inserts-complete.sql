-- ============================================================================
-- EVENTIFY - COMPLETE INSERT DATA FOR ALL TABLES
-- Run this after creating tables with database-schema-complete.sql
-- ============================================================================

-- ============================================================================
-- 1. CATEGORIES
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
-- 2. USERS - Admin, Organizers, Attendees
-- ============================================================================
-- Admin (Password: Admin@123)
INSERT INTO users (id, email, password_hash, full_name, role, status, email_verified_at, created_at)
VALUES (gen_random_uuid(), 'admin@eventify.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator', 'admin', 'active', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Organizers (Password: Organizer@123)
INSERT INTO users (id, email, password_hash, full_name, phone, role, status, email_verified_at, created_at) VALUES
(gen_random_uuid(), 'organizer1@eventify.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Tech Events Pro', '+91-9876543210', 'organizer', 'active', NOW(), NOW()),
(gen_random_uuid(), 'organizer2@eventify.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Music Fiesta', '+91-9876543211', 'organizer', 'active', NOW(), NOW()),
(gen_random_uuid(), 'organizer3@eventify.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Business Hub', '+91-9876543212', 'organizer', 'active', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Attendees (Password: Attendee@123)
INSERT INTO users (id, email, password_hash, full_name, phone, role, status, email_verified_at, created_at) VALUES
(gen_random_uuid(), 'mihir@eventify.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mihir Mashru', '+91-9876543213', 'attendee', 'active', NOW(), NOW()),
(gen_random_uuid(), 'john@eventify.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John Doe', '+91-9876543214', 'attendee', 'active', NOW(), NOW()),
(gen_random_uuid(), 'jane@eventify.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane Smith', '+91-9876543215', 'attendee', 'active', NOW(), NOW()),
(gen_random_uuid(), 'rahul@eventify.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Rahul Patel', '+91-9876543216', 'attendee', 'active', NOW(), NOW()),
(gen_random_uuid(), 'priya@eventify.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Priya Sharma', '+91-9876543217', 'attendee', 'active', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- 3. USER PROFILES
-- ============================================================================
INSERT INTO user_profiles (id, user_id, address, city, state, country, postal_code, language, currency, timezone, newsletter_subscribed, company_name, job_title, bio, created_at)
SELECT gen_random_uuid(), id, '123 Main Street', 'Ahmedabad', 'Gujarat', 'India', '380001', 'en', 'INR', 'Asia/Kolkata', TRUE, 'Eventify Inc', 'Event Enthusiast', 'Love attending tech and music events', NOW()
FROM users WHERE email = 'mihir@eventify.com' ON CONFLICT (user_id) DO NOTHING;

INSERT INTO user_profiles (id, user_id, address, city, state, country, postal_code, language, currency, timezone, newsletter_subscribed, job_title, bio, created_at)
SELECT gen_random_uuid(), id, '456 Park Avenue', 'Mumbai', 'Maharashtra', 'India', '400001', 'en', 'INR', 'Asia/Kolkata', TRUE, 'Software Engineer', 'Tech lover and event goer', NOW()
FROM users WHERE email = 'john@eventify.com' ON CONFLICT (user_id) DO NOTHING;

-- ============================================================================
-- 4. ORGANIZER PROFILES
-- ============================================================================
INSERT INTO organizer_profiles (id, user_id, company_name, company_description, industry, business_email, business_phone, address, city, state, country, website_url, is_verified, verified_at, total_events, total_revenue, rating, created_at)
SELECT gen_random_uuid(), id, 'TechEvents Pro', 'Professional technology event management company', 'Technology', 'contact@techevents.com', '+91-9876543210', '456 Business Park, SG Highway', 'Ahmedabad', 'Gujarat', 'India', 'https://techevents.com', TRUE, NOW(), 5, 250000.00, 4.8, NOW()
FROM users WHERE email = 'organizer1@eventify.com' ON CONFLICT (user_id) DO NOTHING;

INSERT INTO organizer_profiles (id, user_id, company_name, company_description, industry, business_email, business_phone, address, city, state, country, website_url, is_verified, verified_at, total_events, total_revenue, rating, created_at)
SELECT gen_random_uuid(), id, 'MusicFiesta', 'Premier music festival organizers', 'Entertainment', 'info@musicfiesta.com', '+91-9876543211', '789 Entertainment Hub, Bandra', 'Mumbai', 'Maharashtra', 'India', 'https://musicfiesta.com', TRUE, NOW(), 3, 500000.00, 4.9, NOW()
FROM users WHERE email = 'organizer2@eventify.com' ON CONFLICT (user_id) DO NOTHING;

INSERT INTO organizer_profiles (id, user_id, company_name, company_description, industry, business_email, business_phone, address, city, state, country, website_url, is_verified, verified_at, total_events, total_revenue, rating, created_at)
SELECT gen_random_uuid(), id, 'Business Hub Delhi', 'Corporate event management specialists', 'Business', 'corporate@businesshub.com', '+91-9876543212', '101 Connaught Place', 'New Delhi', 'Delhi', 'India', 'https://businesshub.com', TRUE, NOW(), 8, 750000.00, 4.7, NOW()
FROM users WHERE email = 'organizer3@eventify.com' ON CONFLICT (user_id) DO NOTHING;

-- ============================================================================
-- 5. VENUES
-- ============================================================================
INSERT INTO venues (id, managed_by, name, description, address, city, state, country, postal_code, max_capacity, facilities, amenities, contact_phone, contact_email, is_active, verified_at, created_at)
SELECT gen_random_uuid(), u.id, 'Tech Convention Center Ahmedabad', 'State-of-the-art convention center with modern facilities', '123 Tech Park Road, SG Highway', 'Ahmedabad', 'Gujarat', 'India', '380051', 500, '{"wifi": true, "parking": true, "ac": true, "projector": true, "catering": true}'::jsonb, ARRAY['WiFi', 'Parking', 'AC', 'Projector', 'Catering'], '+91-79-12345678', 'venue@techconvention.com', TRUE, NOW(), NOW()
FROM users u WHERE u.email = 'organizer1@eventify.com' ON CONFLICT DO NOTHING;

INSERT INTO venues (id, managed_by, name, description, address, city, state, country, postal_code, max_capacity, facilities, amenities, contact_phone, is_active, created_at)
SELECT gen_random_uuid(), u.id, 'Music Arena Mumbai', 'Large outdoor arena perfect for music festivals', '456 Bandra West', 'Mumbai', 'Maharashtra', 'India', '400050', 2000, '{"stage": true, "sound_system": true, "lighting": true, "parking": true}'::jsonb, ARRAY['Stage', 'Sound System', 'Lighting', 'Parking'], '+91-22-87654321', TRUE, NOW()
FROM users u WHERE u.email = 'organizer2@eventify.com' ON CONFLICT DO NOTHING;

INSERT INTO venues (id, name, description, address, city, state, country, postal_code, max_capacity, facilities, amenities, contact_phone, is_active, created_at)
VALUES 
(gen_random_uuid(), 'Virtual Event Platform', 'Online virtual event platform', 'Online', 'Global', 'Global', 'Global', '000000', 10000, '{"zoom": true, "streaming": true, "recording": true}'::jsonb, ARRAY['Streaming', 'Recording', 'Chat'], '+1-800-VIRTUAL', TRUE, NOW()),
(gen_random_uuid(), 'Business Hub Delhi', 'Premium business conference center', '101 Connaught Place', 'New Delhi', 'Delhi', 'India', '110001', 300, '{"wifi": true, "projector": true, "video_conference": true, "catering": true}'::jsonb, ARRAY['WiFi', 'Projector', 'Video Conference', 'Catering'], '+91-11-23456789', TRUE, NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 6. EVENTS
-- ============================================================================
-- Event 1: Tech Summit 2025
INSERT INTO events (id, organizer_id, category_id, venue_id, title, slug, description, short_description, start_at, end_at, status, banner_url, base_price, currency, max_attendees, total_bookings, is_featured, is_private, refund_policy, website_url, published_at, created_at)
SELECT gen_random_uuid(), o.id, c.id, v.id, 'Tech Summit 2025', 'tech-summit-2025', 'Join us for the biggest technology summit of the year. Learn about AI, ML, Blockchain, and more from industry experts.', 'Biggest tech summit with AI, ML, Blockchain experts', NOW() + INTERVAL '7 days', NOW() + INTERVAL '8 days', 'published', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200', 999.00, 'INR', 500, 150, TRUE, FALSE, 'Full refund available up to 48 hours before the event.', 'https://techsummit2025.com', NOW(), NOW()
FROM users o, categories c, venues v
WHERE o.email = 'organizer1@eventify.com' AND c.slug = 'technology' AND v.name = 'Tech Convention Center Ahmedabad'
ON CONFLICT (slug) DO NOTHING;

-- Event 2: Music Festival Mumbai
INSERT INTO events (id, organizer_id, category_id, venue_id, title, slug, description, short_description, start_at, end_at, status, banner_url, base_price, currency, max_attendees, total_bookings, is_featured, is_private, refund_policy, website_url, published_at, created_at)
SELECT gen_random_uuid(), o.id, c.id, v.id, 'Music Festival Mumbai 2025', 'music-festival-mumbai-2025', 'Experience the ultimate music festival with top artists from across India. Food, fun, and unforgettable memories await!', 'Ultimate music festival with top Indian artists', NOW() + INTERVAL '14 days', NOW() + INTERVAL '15 days', 'published', 'https://images.unsplash.com/photo-1459749411177-047381bb3ece?w=1200', 1499.00, 'INR', 2000, 800, TRUE, FALSE, 'No refunds after ticket purchase.', 'https://musicfestival2025.com', NOW(), NOW()
FROM users o, categories c, venues v
WHERE o.email = 'organizer2@eventify.com' AND c.slug = 'music' AND v.name = 'Music Arena Mumbai'
ON CONFLICT (slug) DO NOTHING;

-- Event 3: Business Leadership Summit
INSERT INTO events (id, organizer_id, category_id, venue_id, title, slug, description, short_description, start_at, end_at, status, banner_url, base_price, currency, max_attendees, total_bookings, is_featured, is_private, refund_policy, website_url, published_at, created_at)
SELECT gen_random_uuid(), o.id, c.id, v.id, 'Business Leadership Summit', 'business-leadership-summit', 'Learn from top business leaders about leadership, management, and entrepreneurship. Network with industry professionals.', 'Leadership and entrepreneurship networking event', NOW() + INTERVAL '21 days', NOW() + INTERVAL '22 days', 'published', 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200', 2499.00, 'INR', 300, 100, FALSE, FALSE, '50% refund up to 7 days before event.', 'https://businesssummit2025.com', NOW(), NOW()
FROM users o, categories c, venues v
WHERE o.email = 'organizer3@eventify.com' AND c.slug = 'business' AND v.name = 'Business Hub Delhi'
ON CONFLICT (slug) DO NOTHING;

-- Event 4: Health & Wellness Workshop (Online)
INSERT INTO events (id, organizer_id, category_id, venue_id, title, slug, description, short_description, start_at, end_at, status, banner_url, base_price, currency, max_attendees, total_bookings, is_featured, is_private, refund_policy, website_url, published_at, created_at)
SELECT gen_random_uuid(), o.id, c.id, v.id, 'Mindfulness & Wellness Workshop', 'mindfulness-wellness-workshop', 'Join our online wellness workshop to learn mindfulness techniques for a healthier lifestyle.', 'Online wellness and mindfulness workshop', NOW() + INTERVAL '3 days', NOW() + INTERVAL '4 days', 'published', 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200', 499.00, 'INR', 200, 50, FALSE, FALSE, 'Full refund before event start.', 'https://wellness2025.com', NOW(), NOW()
FROM users o, categories c, venues v
WHERE o.email = 'organizer1@eventify.com' AND c.slug = 'health-wellness' AND v.name = 'Virtual Event Platform'
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 7. TICKET TYPES
-- ============================================================================
-- Tech Summit Tickets
INSERT INTO ticket_types (id, event_id, name, description, tier_type, price, original_price, quantity_available, quantity_sold, min_per_booking, max_per_booking, is_active, created_at)
SELECT gen_random_uuid(), e.id, 'Early Bird', 'Early bird special price - Limited availability', 'early_bird', 799.00, 999.00, 100, 50, 1, 5, TRUE, NOW()
FROM events e WHERE e.title = 'Tech Summit 2025' ON CONFLICT DO NOTHING;

INSERT INTO ticket_types (id, event_id, name, description, tier_type, price, quantity_available, quantity_sold, min_per_booking, max_per_booking, is_active, created_at)
SELECT gen_random_uuid(), e.id, 'Regular', 'Regular admission ticket', 'regular', 999.00, 400, 100, 1, 10, TRUE, NOW()
FROM events e WHERE e.title = 'Tech Summit 2025' ON CONFLICT DO NOTHING;

INSERT INTO ticket_types (id, event_id, name, description, tier_type, price, quantity_available, quantity_sold, min_per_booking, max_per_booking, is_active, created_at)
SELECT gen_random_uuid(), e.id, 'VIP Access', 'VIP lounge access with exclusive perks', 'vip', 1999.00, 50, 0, 1, 2, TRUE, NOW()
FROM events e WHERE e.title = 'Tech Summit 2025' ON CONFLICT DO NOTHING;

-- Music Festival Tickets
INSERT INTO ticket_types (id, event_id, name, description, tier_type, price, quantity_available, quantity_sold, min_per_booking, max_per_booking, is_active, created_at)
SELECT gen_random_uuid(), e.id, 'General Admission', 'Standard entry ticket', 'regular', 1499.00, 1500, 600, 1, 10, TRUE, NOW()
FROM events e WHERE e.title = 'Music Festival Mumbai 2025' ON CONFLICT DO NOTHING;

INSERT INTO ticket_types (id, event_id, name, description, tier_type, price, quantity_available, quantity_sold, min_per_booking, max_per_booking, is_active, created_at)
SELECT gen_random_uuid(), e.id, 'VIP Pass', 'VIP area access with premium amenities', 'vip', 2999.00, 500, 200, 1, 5, TRUE, NOW()
FROM events e WHERE e.title = 'Music Festival Mumbai 2025' ON CONFLICT DO NOTHING;

-- ============================================================================
-- 8. BOOKINGS
-- ============================================================================
INSERT INTO bookings (id, event_id, user_id, booking_reference, status, subtotal, discount_amount, tax_amount, total_amount, cancellation_reason, notes, created_at)
SELECT gen_random_uuid(), e.id, u.id, 'EVT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-1001', 'confirmed', 999.00, 0.00, 179.82, 1178.82, NULL, 'First booking for Tech Summit', NOW()
FROM events e, users u WHERE e.title = 'Tech Summit 2025' AND u.email = 'mihir@eventify.com' ON CONFLICT (booking_reference) DO NOTHING;

INSERT INTO bookings (id, event_id, user_id, booking_reference, status, subtotal, discount_amount, tax_amount, total_amount, created_at)
SELECT gen_random_uuid(), e.id, u.id, 'EVT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-1002', 'confirmed', 1499.00, 0.00, 269.82, 1768.82, NOW()
FROM events e, users u WHERE e.title = 'Music Festival Mumbai 2025' AND u.email = 'mihir@eventify.com' ON CONFLICT (booking_reference) DO NOTHING;

INSERT INTO bookings (id, event_id, user_id, booking_reference, status, subtotal, discount_amount, tax_amount, total_amount, created_at)
SELECT gen_random_uuid(), e.id, u.id, 'EVT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-1003', 'pending', 2499.00, 0.00, 449.82, 2948.82, NOW()
FROM events e, users u WHERE e.title = 'Business Leadership Summit' AND u.email = 'john@eventify.com' ON CONFLICT (booking_reference) DO NOTHING;

INSERT INTO bookings (id, event_id, user_id, booking_reference, status, subtotal, discount_amount, tax_amount, total_amount, created_at)
SELECT gen_random_uuid(), e.id, u.id, 'EVT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-1004', 'confirmed', 499.00, 0.00, 89.82, 588.82, NOW()
FROM events e, users u WHERE e.title = 'Mindfulness & Wellness Workshop' AND u.email = 'jane@eventify.com' ON CONFLICT (booking_reference) DO NOTHING;

-- ============================================================================
-- 9. PAYMENTS
-- ============================================================================
INSERT INTO payments (id, booking_id, payment_reference, amount, currency, status, gateway, gateway_transaction_id, payment_method, paid_at, created_at)
SELECT gen_random_uuid(), b.id, 'PAY-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-5001', b.total_amount, 'INR', 'success', 'razorpay', 'pay_' || EXTRACT(EPOCH FROM NOW())::TEXT, 'upi', NOW(), NOW()
FROM bookings b WHERE b.booking_reference = 'EVT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-1001' ON CONFLICT DO NOTHING;

INSERT INTO payments (id, booking_id, payment_reference, amount, currency, status, gateway, gateway_transaction_id, payment_method, paid_at, created_at)
SELECT gen_random_uuid(), b.id, 'PAY-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-5002', b.total_amount, 'INR', 'success', 'razorpay', 'pay_' || EXTRACT(EPOCH FROM NOW())::TEXT, 'card', NOW(), NOW()
FROM bookings b WHERE b.booking_reference = 'EVT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-1002' ON CONFLICT DO NOTHING;

-- ============================================================================
-- 10. WISHLISTS
-- ============================================================================
INSERT INTO wishlists (id, user_id, event_id, notes, created_at)
SELECT gen_random_uuid(), u.id, e.id, 'Looking forward to this event!', NOW()
FROM users u, events e WHERE u.email = 'mihir@eventify.com' AND e.title = 'Business Leadership Summit' ON CONFLICT (user_id, event_id) DO NOTHING;

INSERT INTO wishlists (id, user_id, event_id, created_at)
SELECT gen_random_uuid(), u.id, e.id, NOW()
FROM users u, events e WHERE u.email = 'john@eventify.com' AND e.title = 'Tech Summit 2025' ON CONFLICT (user_id, event_id) DO NOTHING;

-- ============================================================================
-- 11. REVIEWS
-- ============================================================================
INSERT INTO reviews (id, event_id, user_id, booking_id, overall_rating, value_rating, venue_rating, organization_rating, title, content, is_approved, helpful_count, verified_purchase, created_at)
SELECT gen_random_uuid(), e.id, u.id, b.id, 5, 5, 5, 5, 'Amazing Tech Event!', 'The Tech Summit was incredibly well organized. Great speakers and networking opportunities. Highly recommend!', TRUE, 12, TRUE, NOW()
FROM events e, users u, bookings b
WHERE e.title = 'Tech Summit 2025' AND u.email = 'mihir@eventify.com' AND b.booking_reference LIKE 'EVT-%'
LIMIT 1 ON CONFLICT DO NOTHING;

INSERT INTO reviews (id, event_id, user_id, overall_rating, value_rating, venue_rating, organization_rating, title, content, is_approved, helpful_count, verified_purchase, created_at)
SELECT gen_random_uuid(), e.id, u.id, 5, 4, 5, 4, 'Great Music Festival!', 'Amazing lineup and great vibes. Food stalls were good too. Will attend again!', TRUE, 8, TRUE, NOW()
FROM events e, users u WHERE e.title = 'Music Festival Mumbai 2025' AND u.email = 'mihir@eventify.com' ON CONFLICT DO NOTHING;

-- ============================================================================
-- 12. NOTIFICATIONS
-- ============================================================================
INSERT INTO notifications (id, user_id, type, title, message, data, is_read, created_at)
SELECT gen_random_uuid(), u.id, 'booking_confirmation', 'Booking Confirmed!', 'Your booking for Tech Summit 2025 has been confirmed. See you there!', '{"event_id": "' || e.id || '", "booking_id": "' || b.id || '"}'::jsonb, FALSE, NOW()
FROM users u, events e, bookings b
WHERE u.email = 'mihir@eventify.com' AND e.title = 'Tech Summit 2025' AND b.event_id = e.id ON CONFLICT DO NOTHING;

INSERT INTO notifications (id, user_id, type, title, message, is_read, created_at)
SELECT gen_random_uuid(), u.id, 'event_reminder', 'Event Reminder', 'Tech Summit 2025 is coming up in 2 days!', FALSE, NOW()
FROM users u WHERE u.email = 'mihir@eventify.com' ON CONFLICT DO NOTHING;

-- ============================================================================
-- 13. SYSTEM SETTINGS
-- ============================================================================
INSERT INTO system_settings (id, settings_key, settings_value, type, category, description) VALUES
(gen_random_uuid(), 'site_name', 'Eventify', 'string', 'general', 'Website name'),
(gen_random_uuid(), 'site_logo', '/logo.png', 'string', 'general', 'Site logo URL'),
(gen_random_uuid(), 'platform_fee_percentage', '2.5', 'number', 'payment', 'Platform fee percentage'),
(gen_random_uuid(), 'gst_percentage', '18', 'number', 'payment', 'GST percentage'),
(gen_random_uuid(), 'default_currency', 'INR', 'string', 'general', 'Default currency code'),
(gen_random_uuid(), 'enable_user_registration', 'true', 'boolean', 'security', 'Allow new user registration'),
(gen_random_uuid(), 'max_login_attempts', '5', 'number', 'security', 'Max failed login attempts'),
(gen_random_uuid(), 'support_email', 'admin@eventify.com', 'string', 'general', 'Support email address')
ON CONFLICT (settings_key) DO NOTHING;

-- ============================================================================
-- 14. EVENT TAGS
-- ============================================================================
INSERT INTO event_tags (id, name, slug, color, is_active, usage_count, created_at) VALUES
(gen_random_uuid(), 'AI & Machine Learning', 'ai-machine-learning', '#3B82F6', TRUE, 1, NOW()),
(gen_random_uuid(), 'Blockchain', 'blockchain', '#8B5CF6', TRUE, 1, NOW()),
(gen_random_uuid(), 'Live Music', 'live-music', '#F59E0B', TRUE, 1, NOW()),
(gen_random_uuid(), 'Networking', 'networking', '#10B981', TRUE, 1, NOW()),
(gen_random_uuid(), 'Leadership', 'leadership', '#EF4444', TRUE, 1, NOW()),
(gen_random_uuid(), 'Wellness', 'wellness', '#14B8A6', TRUE, 1, NOW())
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 15. EVENT TAG RELATIONS
-- ============================================================================
INSERT INTO event_tag_relations (event_id, tag_id)
SELECT e.id, t.id FROM events e, event_tags t WHERE e.title = 'Tech Summit 2025' AND t.slug = 'ai-machine-learning' ON CONFLICT DO NOTHING;
INSERT INTO event_tag_relations (event_id, tag_id)
SELECT e.id, t.id FROM events e, event_tags t WHERE e.title = 'Tech Summit 2025' AND t.slug = 'blockchain' ON CONFLICT DO NOTHING;
INSERT INTO event_tag_relations (event_id, tag_id)
SELECT e.id, t.id FROM events e, event_tags t WHERE e.title = 'Music Festival Mumbai 2025' AND t.slug = 'live-music' ON CONFLICT DO NOTHING;
INSERT INTO event_tag_relations (event_id, tag_id)
SELECT e.id, t.id FROM events e, event_tags t WHERE e.title = 'Business Leadership Summit' AND t.slug = 'networking' ON CONFLICT DO NOTHING;
INSERT INTO event_tag_relations (event_id, tag_id)
SELECT e.id, t.id FROM events e, event_tags t WHERE e.title = 'Business Leadership Summit' AND t.slug = 'leadership' ON CONFLICT DO NOTHING;

-- ============================================================================
-- 16. EVENT SPEAKERS
-- ============================================================================
INSERT INTO event_speakers (id, event_id, name, bio, designation, company, avatar_url, sort_order, created_at)
SELECT gen_random_uuid(), e.id, 'Dr. A. P. J. Kalam', 'Renowned scientist and former President of India', 'Keynote Speaker', 'ISRO', 'https://randomuser.me/api/portraits/men/1.jpg', 1, NOW()
FROM events e WHERE e.title = 'Tech Summit 2025' ON CONFLICT DO NOTHING;

INSERT INTO event_speakers (id, event_id, name, bio, designation, company, avatar_url, sort_order, created_at)
SELECT gen_random_uuid(), e.id, 'Sundar Pichai', 'CEO of Google and Alphabet', 'Guest Speaker', 'Google', 'https://randomuser.me/api/portraits/men/2.jpg', 2, NOW()
FROM events e WHERE e.title = 'Tech Summit 2025' ON CONFLICT DO NOTHING;

INSERT INTO event_speakers (id, event_id, name, bio, designation, avatar_url, sort_order, created_at)
SELECT gen_random_uuid(), e.id, 'Arijit Singh', 'Bollywood playback singer', 'Headlining Artist', 'https://randomuser.me/api/portraits/men/3.jpg', 1, NOW()
FROM events e WHERE e.title = 'Music Festival Mumbai 2025' ON CONFLICT DO NOTHING;

-- ============================================================================
-- 17. EVENT SCHEDULE
-- ============================================================================
INSERT INTO event_schedule (id, event_id, day_number, title, description, start_time, end_time, location, created_at)
SELECT gen_random_uuid(), e.id, 1, 'Opening Keynote', 'Welcome address and keynote presentation', '09:00:00'::TIME, '10:00:00'::TIME, 'Main Hall', NOW()
FROM events e WHERE e.title = 'Tech Summit 2025' ON CONFLICT DO NOTHING;

INSERT INTO event_schedule (id, event_id, day_number, title, description, start_time, end_time, location, created_at)
SELECT gen_random_uuid(), e.id, 1, 'AI Workshop', 'Hands-on AI and Machine Learning workshop', '11:00:00'::TIME, '13:00:00'::TIME, 'Workshop Room A', NOW()
FROM events e WHERE e.title = 'Tech Summit 2025' ON CONFLICT DO NOTHING;

INSERT INTO event_schedule (id, event_id, day_number, title, description, start_time, end_time, location, created_at)
SELECT gen_random_uuid(), e.id, 1, 'Main Concert', 'Evening concert with headlining artists', '18:00:00'::TIME, '23:00:00'::TIME, 'Main Stage', NOW()
FROM events e WHERE e.title = 'Music Festival Mumbai 2025' ON CONFLICT DO NOTHING;

-- ============================================================================
-- 18. PROMO CODES
-- ============================================================================
INSERT INTO promo_codes (id, code, description, discount_type, discount_value, max_discount_amount, max_uses, current_uses, valid_from, valid_until, applicable_ticket_types, min_order_amount, is_active, created_at)
SELECT gen_random_uuid(), 'WELCOME10', '10% off for new users', 'percentage', 10.00, 200.00, 100, 0, NOW(), NOW() + INTERVAL '30 days', ARRAY[]::UUID[], 500.00, TRUE, NOW()
ON CONFLICT (code) DO NOTHING;

INSERT INTO promo_codes (id, code, description, discount_type, discount_value, max_discount_amount, max_uses, current_uses, valid_from, valid_until, applicable_ticket_types, min_order_amount, is_active, created_at)
SELECT gen_random_uuid(), 'TECH500', 'Flat Rs 500 off on Tech Summit', 'fixed', 500.00, NULL, 50, 0, NOW(), NOW() + INTERVAL '7 days', ARRAY[]::UUID[], 999.00, TRUE, NOW()
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- 19. CONTACT MESSAGES
-- ============================================================================
INSERT INTO contact_messages (id, name, email, subject, message, status, priority, created_at)
VALUES (gen_random_uuid(), 'Rahul Kumar', 'rahul@example.com', 'Question about Tech Summit', 'Hi, I wanted to know if group discounts are available for Tech Summit 2025?', 'unread', 'medium', NOW()),
(gen_random_uuid(), 'Priya Sharma', 'priya@example.com', 'Vendor Inquiry', 'I would like to become a vendor at Music Festival Mumbai. How can I apply?', 'read', 'low', NOW()),
(gen_random_uuid(), 'Vikram Patel', 'vikram@example.com', 'Refund Request', 'I need to cancel my booking and request a refund due to a family emergency.', 'replied', 'high', NOW() - INTERVAL '2 days')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 20. EMAIL TEMPLATES
-- ============================================================================
INSERT INTO email_templates (id, name, subject, body_html, body_text, variables, is_active, created_at)
VALUES 
(gen_random_uuid(), 'booking_confirmation', 'Your Booking is Confirmed!', 
'<h1>Booking Confirmed!</h1><p>Hi {{name}},</p><p>Your booking for {{event_name}} has been confirmed.</p><p>Booking Reference: {{booking_ref}}</p>', 
'Hi {{name}}, Your booking for {{event_name}} is confirmed. Ref: {{booking_ref}}',
ARRAY['name', 'event_name', 'booking_ref'], TRUE, NOW()),
(gen_random_uuid(), 'event_reminder', 'Reminder: {{event_name}} is Tomorrow!',
'<h1>Event Reminder</h1><p>Hi {{name}},</p><p>{{event_name}} is tomorrow at {{event_time}}.</p><p>See you there!</p>',
'Hi {{name}}, {{event_name}} is tomorrow at {{event_time}}. See you there!',
ARRAY['name', 'event_name', 'event_time'], TRUE, NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 21. NEWSLETTER SUBSCRIBERS
-- ============================================================================
INSERT INTO newsletter_subscribers (id, email, name, is_active, subscribed_at)
VALUES (gen_random_uuid(), 'subscriber1@example.com', 'Subscriber One', TRUE, NOW()),
(gen_random_uuid(), 'subscriber2@example.com', 'Subscriber Two', TRUE, NOW()),
(gen_random_uuid(), 'subscriber3@example.com', 'Subscriber Three', TRUE, NOW())
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- 22. ACTIVITY LOGS
-- ============================================================================
INSERT INTO activity_logs (id, user_id, action, entity_type, entity_id, description, ip_address, user_agent, created_at)
SELECT gen_random_uuid(), u.id, 'login', 'user', u.id, 'User logged in successfully', '192.168.1.100', 'Mozilla/5.0', NOW()
FROM users u WHERE u.email = 'admin@eventify.com' ON CONFLICT DO NOTHING;

INSERT INTO activity_logs (id, user_id, action, entity_type, entity_id, description, ip_address, created_at)
SELECT gen_random_uuid(), u.id, 'booking_created', 'booking', b.id, 'Created new booking for ' || e.title, '192.168.1.101', NOW()
FROM users u, bookings b, events e WHERE u.email = 'mihir@eventify.com' AND b.user_id = u.id AND e.id = b.event_id ON CONFLICT DO NOTHING;

INSERT INTO activity_logs (id, user_id, action, entity_type, description, created_at)
SELECT gen_random_uuid(), u.id, 'event_created', 'event', 'Created new event: Tech Summit 2025', NOW()
FROM users u WHERE u.email = 'organizer1@eventify.com' ON CONFLICT DO NOTHING;

-- ============================================================================
-- 23. TICKET INVENTORY (Initialize)
-- ============================================================================
INSERT INTO ticket_inventory (ticket_type_id, available_quantity, reserved_quantity, sold_quantity, last_updated)
SELECT id, quantity_available, 0, quantity_sold, NOW() FROM ticket_types ON CONFLICT DO NOTHING;

-- ============================================================================
-- 24. ORGANIZER APPLICATIONS
-- ============================================================================
INSERT INTO organizer_applications (id, user_id, organization_name, organization_type, registration_number, tax_id, business_email, business_phone, website_url, description, status, reviewed_by, reviewed_at, rejection_reason, created_at)
SELECT gen_random_uuid(), u.id, 'Food Fiesta Events', 'Food & Beverage', 'REG-12345', 'GST-123456789', 'info@foodfiesta.com', '+91-9876543218', 'https://foodfiesta.com', 'We organize food festivals and culinary events across India.', 'pending', a.id, NOW(), NULL, NOW()
FROM users u, users a
WHERE u.email = 'mihir@eventify.com' AND a.email = 'admin@eventify.com' AND u.id != a.id
LIMIT 1 ON CONFLICT DO NOTHING;

-- ============================================================================
-- 25. EVENT VIEWS (Sample analytics)
-- ============================================================================
INSERT INTO event_views (event_id, user_id, ip_address, user_agent, referrer, viewed_at)
SELECT e.id, u.id, '192.168.1.105', 'Mozilla/5.0', 'https://google.com', NOW() - INTERVAL '1 hour'
FROM events e, users u WHERE e.title = 'Tech Summit 2025' AND u.email = 'john@eventify.com' ON CONFLICT DO NOTHING;

INSERT INTO event_views (event_id, user_id, ip_address, user_agent, viewed_at)
SELECT e.id, u.id, '192.168.1.106', 'Chrome/91.0', NOW() - INTERVAL '30 minutes'
FROM events e, users u WHERE e.title = 'Music Festival Mumbai 2025' AND u.email = 'jane@eventify.com' ON CONFLICT DO NOTHING;

-- ============================================================================
-- 26. CART ITEMS (Sample)
-- ============================================================================
INSERT INTO cart_items (id, user_id, event_id, ticket_type_id, quantity, unit_price, total_price, created_at)
SELECT gen_random_uuid(), u.id, e.id, tt.id, 2, tt.price, tt.price * 2, NOW()
FROM users u, events e, ticket_types tt
WHERE u.email = 'rahul@eventify.com' AND e.title = 'Business Leadership Summit' AND tt.event_id = e.id AND tt.tier_type = 'regular'
LIMIT 1 ON CONFLICT DO NOTHING;

-- ============================================================================
-- 27. REFUNDS (Sample)
-- ============================================================================
INSERT INTO refunds (id, payment_id, booking_id, amount, reason, status, processed_by, processed_at, created_at)
SELECT gen_random_uuid(), p.id, b.id, 500.00, 'Event timing conflict', 'approved', a.id, NOW(), NOW() - INTERVAL '3 days'
FROM payments p, bookings b, users a
WHERE p.booking_id = b.id AND b.status = 'cancelled' AND a.email = 'admin@eventify.com'
LIMIT 1 ON CONFLICT DO NOTHING;

-- ============================================================================
-- 28. REVIEW VOTES
-- ============================================================================
INSERT INTO review_votes (review_id, user_id, is_helpful, created_at)
SELECT r.id, u.id, TRUE, NOW()
FROM reviews r, users u WHERE u.email = 'john@eventify.com' AND r.title LIKE '%Tech%' LIMIT 1 ON CONFLICT DO NOTHING;

INSERT INTO review_votes (review_id, user_id, is_helpful, created_at)
SELECT r.id, u.id, TRUE, NOW()
FROM reviews r, users u WHERE u.email = 'jane@eventify.com' AND r.title LIKE '%Music%' LIMIT 1 ON CONFLICT DO NOTHING;

-- ============================================================================
-- VERIFICATION - Check Data Inserted
-- ============================================================================
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL SELECT 'Categories', COUNT(*) FROM categories
UNION ALL SELECT 'Venues', COUNT(*) FROM venues
UNION ALL SELECT 'Events', COUNT(*) FROM events
UNION ALL SELECT 'Ticket Types', COUNT(*) FROM ticket_types
UNION ALL SELECT 'Bookings', COUNT(*) FROM bookings
UNION ALL SELECT 'Payments', COUNT(*) FROM payments
UNION ALL SELECT 'Reviews', COUNT(*) FROM reviews
UNION ALL SELECT 'Wishlists', COUNT(*) FROM wishlists
UNION ALL SELECT 'Notifications', COUNT(*) FROM notifications
UNION ALL SELECT 'Event Tags', COUNT(*) FROM event_tags
UNION ALL SELECT 'Event Speakers', COUNT(*) FROM event_speakers
UNION ALL SELECT 'Activity Logs', COUNT(*) FROM activity_logs
UNION ALL SELECT 'Contact Messages', COUNT(*) FROM contact_messages
ORDER BY table_name;
