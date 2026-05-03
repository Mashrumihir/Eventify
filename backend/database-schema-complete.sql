-- ============================================================================
-- EVENTIFY COMPLETE DATABASE SCHEMA
-- Real-World Problem Solving Design
-- PostgreSQL with UUID Primary Keys
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. ENUM TYPES (Status & Role Management)
-- ============================================================================

DO $$
BEGIN
    -- User roles
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('attendee', 'organizer', 'admin', 'super_admin');
    END IF;

    -- Account status with suspension capability
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_status') THEN
        CREATE TYPE account_status AS ENUM ('pending', 'active', 'suspended', 'blocked', 'deleted');
    END IF;

    -- Organizer application flow
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
        CREATE TYPE application_status AS ENUM ('draft', 'submitted', 'under_review', 'approved', 'rejected');
    END IF;

    -- Event lifecycle
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_status') THEN
        CREATE TYPE event_status AS ENUM ('draft', 'pending_review', 'published', 'cancelled', 'postponed', 'completed', 'archived');
    END IF;

    -- Booking states with refund handling
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
        CREATE TYPE booking_status AS ENUM (
            'pending_payment',      -- Booked but not paid
            'confirmed',            -- Paid and confirmed
            'checked_in',          -- Attendee checked in
            'no_show',             -- Did not attend
            'cancelled',           -- Cancelled by user
            'refund_requested',    -- Refund in process
            'refunded',            -- Money returned
            'partially_refunded'   -- Partial refund
        );
    END IF;

    -- Payment states
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE payment_status AS ENUM (
            'initialized',
            'pending',
            'processing',
            'success',
            'failed',
            'cancelled',
            'refunded',
            'partially_refunded',
            'disputed',
            'chargeback'
        );
    END IF;

    -- Notification types
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
        CREATE TYPE notification_type AS ENUM (
            'booking_confirmation',
            'payment_success',
            'payment_failed',
            'event_reminder',
            'event_cancelled',
            'event_updated',
            'organizer_approved',
            'organizer_rejected',
            'new_review',
            'system_announcement',
            'promotional',
            'security_alert'
        );
    END IF;

    -- Ticket tier types
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_tier') THEN
        CREATE TYPE ticket_tier AS ENUM ('free', 'early_bird', 'regular', 'vip', 'vvip', 'group');
    END IF;

    -- Payment methods
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN
        CREATE TYPE payment_method AS ENUM ('card', 'upi', 'netbanking', 'wallet', 'cod', 'crypto', 'bank_transfer');
    END IF;
END $$;

-- ============================================================================
-- 2. CORE USER MANAGEMENT (All Roles)
-- ============================================================================

-- Master users table with audit fields
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Authentication
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email_verified_at TIMESTAMPTZ,
    
    -- Profile
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    date_of_birth DATE,
    
    -- Role & Status
    role user_role NOT NULL DEFAULT 'attendee',
    status account_status NOT NULL DEFAULT 'pending',
    
    -- Security
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    last_password_change TIMESTAMPTZ DEFAULT NOW(),
    two_factor_secret VARCHAR(32),
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    
    -- Audit
    last_login_at TIMESTAMPTZ,
    last_login_ip INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,  -- Soft delete
    
    -- Constraints
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- User profiles (Extended info)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    postal_code VARCHAR(20),
    
    -- Professional
    company_name VARCHAR(160),
    job_title VARCHAR(100),
    website_url TEXT,
    bio TEXT,
    
    -- Preferences
    preferred_language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    currency VARCHAR(10) DEFAULT 'INR',
    
    -- Notifications
    email_booking_confirmation BOOLEAN DEFAULT TRUE,
    email_event_reminders BOOLEAN DEFAULT TRUE,
    email_promotions BOOLEAN DEFAULT FALSE,
    push_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User sessions (Security)
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    device_info TEXT,
    ip_address INET,
    is_valid BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_active_at TIMESTAMPTZ
);

-- ============================================================================
-- 3. ORGANIZER MANAGEMENT
-- ============================================================================

-- Organizer applications with full workflow
CREATE TABLE IF NOT EXISTS organizer_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Applicant
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    -- Organization Details
    organization_name VARCHAR(200) NOT NULL,
    organization_type VARCHAR(50),  -- company, individual, nonprofit, etc.
    registration_number VARCHAR(50),  -- Business registration
    tax_id VARCHAR(50),             -- GST/Tax ID
    
    -- Contact
    business_email VARCHAR(255),
    business_phone VARCHAR(20),
    website_url TEXT,
    
    -- Address
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    
    -- Documents
    id_proof_url TEXT,
    address_proof_url TEXT,
    business_license_url TEXT,
    
    -- Application
    status application_status NOT NULL DEFAULT 'draft',
    
    -- Review
    reviewed_by UUID REFERENCES users(id),
    review_notes TEXT,
    reviewed_at TIMESTAMPTZ,
    
    -- Events
    submitted_at TIMESTAMPTZ,
    approved_at TIMESTAMPTZ,
    rejected_at TIMESTAMPTZ,
    rejection_reason TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Organizer profiles (Additional organizer-specific data)
CREATE TABLE IF NOT EXISTS organizer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    -- Stats
    total_events INTEGER DEFAULT 0,
    total_bookings INTEGER DEFAULT 0,
    total_revenue NUMERIC(12, 2) DEFAULT 0,
    average_rating NUMERIC(3, 2) DEFAULT 0,
    
    -- Verification
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    
    -- Commission
    commission_rate NUMERIC(5, 2) DEFAULT 10.00,  -- Percentage
    
    -- Payout
    payout_method payment_method,
    payout_details JSONB,  -- Bank account, UPI, etc.
    
    -- Settings
    auto_payout BOOLEAN DEFAULT FALSE,
    minimum_payout_amount NUMERIC(10, 2) DEFAULT 1000.00,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 4. EVENT MANAGEMENT
-- ============================================================================

-- Categories (Hierarchical)
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Venues
CREATE TABLE IF NOT EXISTS venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic Info
    name VARCHAR(150) NOT NULL,
    description TEXT,
    venue_type VARCHAR(50),  -- auditorium, stadium, outdoor, virtual, etc.
    
    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    postal_code VARCHAR(20),
    
    -- Coordinates (for maps)
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8),
    
    -- Capacity
    total_capacity INTEGER,
    seating_capacity INTEGER,
    standing_capacity INTEGER,
    
    -- Contact
    contact_name VARCHAR(150),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    
    -- Facilities
    facilities JSONB,  -- {parking: true, wifi: true, ac: true, ...}
    
    -- Media
    images JSONB,  -- Array of image URLs
    
    -- Managed by
    managed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Events (Main table)
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic Info
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE,
    description TEXT,
    short_description VARCHAR(500),
    
    -- Organizer
    organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Category & Venue
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    venue_id UUID REFERENCES venues(id) ON DELETE SET NULL,
    
    -- Virtual Event
    is_virtual BOOLEAN DEFAULT FALSE,
    virtual_platform VARCHAR(50),  -- zoom, teams, youtube, etc.
    virtual_link TEXT,
    virtual_password VARCHAR(100),
    
    -- Timing
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ NOT NULL,
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    
    -- Registration
    registration_opens_at TIMESTAMPTZ,
    registration_closes_at TIMESTAMPTZ,
    max_attendees INTEGER,
    min_attendees INTEGER,
    
    -- Pricing
    base_price NUMERIC(10,2) DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'INR',
    is_free BOOLEAN DEFAULT FALSE,
    
    -- Media
    banner_url TEXT,
    thumbnail_url TEXT,
    gallery_images JSONB,  -- Array of URLs
    video_url TEXT,
    
    -- SEO
    meta_title VARCHAR(200),
    meta_description VARCHAR(500),
    keywords TEXT,
    
    -- Status
    status event_status NOT NULL DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    
    -- Features
    is_featured BOOLEAN DEFAULT FALSE,
    is_private BOOLEAN DEFAULT FALSE,
    require_approval BOOLEAN DEFAULT FALSE,
    
    -- Stats (Denormalized for performance)
    view_count INTEGER DEFAULT 0,
    bookmark_count INTEGER DEFAULT 0,
    total_bookings INTEGER DEFAULT 0,
    total_revenue NUMERIC(12, 2) DEFAULT 0,
    average_rating NUMERIC(3, 2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    
    -- Cancellation
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT valid_dates CHECK (end_at > start_at)
);

-- Event Tags (Many-to-many)
CREATE TABLE IF NOT EXISTS event_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS event_tag_relations (
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES event_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (event_id, tag_id)
);

-- Event Schedule (Multi-day events)
CREATE TABLE IF NOT EXISTS event_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    
    day_number INTEGER NOT NULL,
    title VARCHAR(200),
    description TEXT,
    
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    
    location VARCHAR(200),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Event Speakers/Performers
CREATE TABLE IF NOT EXISTS event_speakers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    
    name VARCHAR(150) NOT NULL,
    designation VARCHAR(150),
    company VARCHAR(150),
    bio TEXT,
    avatar_url TEXT,
    social_links JSONB,
    
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 5. TICKET MANAGEMENT
-- ============================================================================

-- Ticket Types (Pricing tiers)
CREATE TABLE IF NOT EXISTS ticket_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    
    -- Basic
    name VARCHAR(100) NOT NULL,
    description TEXT,
    tier ticket_tier NOT NULL DEFAULT 'regular',
    
    -- Pricing
    price NUMERIC(10,2) NOT NULL DEFAULT 0,
    original_price NUMERIC(10,2),  -- For showing discounts
    currency VARCHAR(10) DEFAULT 'INR',
    
    -- Availability
    quantity INTEGER NOT NULL DEFAULT 0,
    sold_count INTEGER NOT NULL DEFAULT 0,
    reserved_count INTEGER NOT NULL DEFAULT 0,  -- Held in cart
    min_per_order INTEGER DEFAULT 1,
    max_per_order INTEGER DEFAULT 10,
    
    -- Sale Period
    sale_starts_at TIMESTAMPTZ,
    sale_ends_at TIMESTAMPTZ,
    
    -- Benefits
    benefits JSONB,  -- [{icon: 'seat', text: 'VIP Seating'}, ...]
    
    -- Visibility
    is_visible BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT positive_price CHECK (price >= 0),
    CONSTRAINT valid_quantity CHECK (quantity >= 0)
);

-- Ticket Inventory (Track available tickets)
CREATE TABLE IF NOT EXISTS ticket_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_type_id UUID NOT NULL UNIQUE REFERENCES ticket_types(id) ON DELETE CASCADE,
    
    available_count INTEGER NOT NULL DEFAULT 0,
    reserved_count INTEGER NOT NULL DEFAULT 0,
    sold_count INTEGER NOT NULL DEFAULT 0,
    
    last_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    version INTEGER DEFAULT 1  -- For optimistic locking
);

-- Promo Codes
CREATE TABLE IF NOT EXISTS promo_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,  -- NULL = global
    
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    
    -- Discount
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(10,2) NOT NULL,
    max_discount_amount NUMERIC(10,2),  -- For percentage discounts
    
    -- Limits
    max_uses INTEGER,
    max_uses_per_user INTEGER DEFAULT 1,
    current_uses INTEGER DEFAULT 0,
    
    -- Validity
    valid_from TIMESTAMPTZ,
    valid_until TIMESTAMPTZ,
    
    -- Applicability
    applicable_ticket_types UUID[],  -- NULL = all tickets
    min_order_amount NUMERIC(10,2),
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 6. BOOKING & PAYMENT (Core Transaction System)
-- ============================================================================

-- Bookings (Orders)
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- References
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    
    -- Booking Info
    booking_reference VARCHAR(20) NOT NULL UNIQUE,
    status booking_status NOT NULL DEFAULT 'pending_payment',
    
    -- Pricing
    subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,        -- Before discount
    discount_amount NUMERIC(10,2) DEFAULT 0,          -- Promo code discount
    tax_amount NUMERIC(10,2) DEFAULT 0,               -- GST/VAT
    convenience_fee NUMERIC(10,2) DEFAULT 0,          -- Platform fee
    total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,    -- Final amount
    currency VARCHAR(10) DEFAULT 'INR',
    
    -- Promo Code
    promo_code_id UUID REFERENCES promo_codes(id),
    promo_code_used VARCHAR(50),
    
    -- Attendee Details
    attendee_name VARCHAR(150),
    attendee_email VARCHAR(255),
    attendee_phone VARCHAR(20),
    special_requests TEXT,
    
    -- Check-in
    checked_in_at TIMESTAMPTZ,
    checked_in_by UUID REFERENCES users(id),
    
    -- Cancellation
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    cancellation_initiated_by UUID REFERENCES users(id),
    
    -- Timestamps
    expires_at TIMESTAMPTZ,  -- Payment deadline
    confirmed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT valid_amounts CHECK (total_amount >= 0)
);

-- Booking Items (Individual tickets in an order)
CREATE TABLE IF NOT EXISTS booking_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    ticket_type_id UUID NOT NULL REFERENCES ticket_types(id) ON DELETE CASCADE,
    
    -- Pricing
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(10,2) NOT NULL,
    discount_per_unit NUMERIC(10,2) DEFAULT 0,
    total_price NUMERIC(10,2) NOT NULL,
    
    -- Attendee (for each ticket)
    attendee_details JSONB,  -- [{name, email, phone, custom_fields}]
    
    -- Individual ticket codes
    ticket_codes JSONB,  -- ['TICKET-001', 'TICKET-002']
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Payments (Transaction records)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- References
    booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Transaction Info
    transaction_id VARCHAR(100) NOT NULL UNIQUE,  -- External transaction ID
    gateway VARCHAR(50) NOT NULL,               -- razorpay, stripe, paypal
    
    -- Amounts
    amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    
    -- Gateway Details
    gateway_payment_id VARCHAR(100),
    gateway_order_id VARCHAR(100),
    gateway_signature VARCHAR(255),
    
    -- Method
    method payment_method,
    method_details JSONB,  -- {last4, card_network, upi_id, etc}
    
    -- Status
    status payment_status NOT NULL DEFAULT 'initialized',
    
    -- Refunds
    refundable_amount NUMERIC(10,2),
    refunded_amount NUMERIC(10,2) DEFAULT 0,
    
    -- Timestamps
    initiated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    failure_reason TEXT,
    
    -- Metadata
    gateway_response JSONB,
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Payment Attempts (Failed retries)
CREATE TABLE IF NOT EXISTS payment_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
    
    attempt_number INTEGER NOT NULL,
    status payment_status,
    error_code VARCHAR(50),
    error_message TEXT,
    gateway_response JSONB,
    
    attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Refunds
CREATE TABLE IF NOT EXISTS refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    
    -- Amount
    amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    
    -- Reason
    reason TEXT,
    reason_category VARCHAR(50),  -- event_cancelled, user_request, duplicate, etc.
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'pending',  -- pending, processing, completed, failed
    
    -- Gateway
    gateway_refund_id VARCHAR(100),
    gateway_response JSONB,
    
    -- Processing
    processed_by UUID REFERENCES users(id),
    processed_at TIMESTAMPTZ,
    
    -- Estimates
    estimated_arrival TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Cart (Temporary holds)
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ticket_type_id UUID NOT NULL REFERENCES ticket_types(id) ON DELETE CASCADE,
    
    quantity INTEGER NOT NULL DEFAULT 1,
    
    -- Lock until
    reserved_until TIMESTAMPTZ NOT NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(user_id, ticket_type_id)
);

-- ============================================================================
-- 7. ENGAGEMENT (Reviews, Wishlists, etc.)
-- ============================================================================

-- Reviews & Ratings
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    
    -- Rating
    overall_rating INTEGER NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
    value_rating INTEGER CHECK (value_rating BETWEEN 1 AND 5),
    venue_rating INTEGER CHECK (venue_rating BETWEEN 1 AND 5),
    organization_rating INTEGER CHECK (organization_rating BETWEEN 1 AND 5),
    
    -- Content
    title VARCHAR(200),
    comment TEXT,
    would_recommend BOOLEAN,
    
    -- Media
    photos JSONB,  -- Array of URLs
    
    -- Moderation
    is_approved BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    moderated_by UUID REFERENCES users(id),
    moderated_at TIMESTAMPTZ,
    moderation_notes TEXT,
    
    -- Response from organizer
    organizer_response TEXT,
    responded_at TIMESTAMPTZ,
    
    -- Engagement
    helpful_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(event_id, user_id)
);

-- Review Helpfulness Votes
CREATE TABLE IF NOT EXISTS review_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_helpful BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(review_id, user_id)
);

-- Wishlists (Saved events)
CREATE TABLE IF NOT EXISTS wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    
    notes TEXT,  -- User's personal notes
    reminder_set BOOLEAN DEFAULT FALSE,
    reminder_time TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(user_id, event_id)
);

-- Event Views (Analytics)
CREATE TABLE IF NOT EXISTS event_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    
    -- Viewer info
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(100),
    ip_address INET,
    
    -- Device info
    user_agent TEXT,
    device_type VARCHAR(50),  -- mobile, tablet, desktop
    browser VARCHAR(50),
    os VARCHAR(50),
    
    -- Referrer
    referrer_url TEXT,
    source VARCHAR(50),  -- direct, social, search, email
    
    viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 8. NOTIFICATIONS (Multi-channel)
-- ============================================================================

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Content
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Action
    action_url TEXT,
    action_text VARCHAR(100),
    
    -- Data
    data JSONB,  -- {event_id, booking_id, payment_id, etc.}
    
    -- Channels
    email_sent BOOLEAN DEFAULT FALSE,
    email_sent_at TIMESTAMPTZ,
    push_sent BOOLEAN DEFAULT FALSE,
    push_sent_at TIMESTAMPTZ,
    sms_sent BOOLEAN DEFAULT FALSE,
    sms_sent_at TIMESTAMPTZ,
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    
    -- Priority
    priority VARCHAR(20) DEFAULT 'normal',  -- low, normal, high, urgent
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Email Templates
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    name VARCHAR(100) NOT NULL UNIQUE,
    subject VARCHAR(255) NOT NULL,
    body_html TEXT NOT NULL,
    body_text TEXT,
    
    -- Variables available: {{user_name}}, {{event_title}}, etc.
    variables JSONB,
    
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 9. ADMIN & SYSTEM
-- ============================================================================

-- Contact Messages
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    
    -- Categorization
    category VARCHAR(50),  -- general, support, sales, partnership
    priority VARCHAR(20) DEFAULT 'normal',
    
    -- Status
    status VARCHAR(20) DEFAULT 'unread',  -- unread, read, replied, resolved, spam
    
    -- Response
    replied_by UUID REFERENCES users(id),
    reply_message TEXT,
    replied_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Newsletter Subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(150),
    
    -- Preferences
    preferences JSONB,  -- {events: true, promotions: false, etc.}
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    
    -- Tracking
    source VARCHAR(50),  -- website, event, import
    ip_address INET,
    
    subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ,
    unsubscribed_reason TEXT
);

-- System Settings (Configuration)
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    key VARCHAR(100) NOT NULL UNIQUE,
    value TEXT,
    
    -- Type for proper casting
    type VARCHAR(20) DEFAULT 'string',  -- string, number, boolean, json
    
    -- Grouping
    category VARCHAR(50),  -- general, payment, email, security
    
    description TEXT,
    
    -- Audit
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Activity Logs (Audit trail)
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Action
    action VARCHAR(100) NOT NULL,  -- login, booking_created, event_updated, etc.
    entity_type VARCHAR(50),       -- user, event, booking, payment
    entity_id UUID,
    
    -- Details
    description TEXT,
    old_values JSONB,
    new_values JSONB,
    
    -- Context
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 10. FINANCIAL (Organizer payouts)
-- ============================================================================

-- Payouts to organizers
CREATE TABLE IF NOT EXISTS payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Amount
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    
    -- Period
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Breakdown
    total_revenue NUMERIC(12, 2),
    platform_fee NUMERIC(12, 2),
    tax_amount NUMERIC(12, 2),
    net_amount NUMERIC(12, 2),
    
    -- Method
    method payment_method,
    payout_details JSONB,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending',  -- pending, processing, completed, failed
    
    -- Processing
    processed_by UUID REFERENCES users(id),
    processed_at TIMESTAMPTZ,
    transaction_id VARCHAR(100),
    
    -- Notes
    notes TEXT,
    failure_reason TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Payout Items (Individual bookings in a payout)
CREATE TABLE IF NOT EXISTS payout_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    payout_id UUID NOT NULL REFERENCES payouts(id) ON DELETE CASCADE,
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    
    gross_amount NUMERIC(10, 2),
    platform_fee NUMERIC(10, 2),
    net_amount NUMERIC(10, 2),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES (Performance Optimization)
-- ============================================================================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Events
CREATE INDEX idx_events_organizer_id ON events(organizer_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_at ON events(start_at);
CREATE INDEX idx_events_category_id ON events(category_id);
CREATE INDEX idx_events_is_featured ON events(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_events_published_at ON events(published_at);

-- Bookings
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_event_id ON bookings(event_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);
CREATE INDEX idx_bookings_reference ON bookings(booking_reference);

-- Payments
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Reviews
CREATE INDEX idx_reviews_event_id ON reviews(event_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_is_approved ON reviews(is_approved);

-- Activity Logs
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- ============================================================================
-- TRIGGERS (Auto-updates)
-- ============================================================================

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS update_%s_updated_at ON %s', t, t);
        EXECUTE format('CREATE TRIGGER update_%s_updated_at 
                       BEFORE UPDATE ON %s 
                       FOR EACH ROW 
                       EXECUTE FUNCTION update_updated_at_column()', t, t);
    END LOOP;
END $$;

-- ============================================================================
-- SAMPLE DATA (For Testing)
-- ============================================================================

-- Sample Categories (using proper UUIDs)
INSERT INTO categories (id, name, slug, description, is_active, sort_order) VALUES
(gen_random_uuid(), 'Technology', 'technology', 'Tech events, conferences, and workshops', TRUE, 1),
(gen_random_uuid(), 'Business', 'business', 'Business networking and seminars', TRUE, 2),
(gen_random_uuid(), 'Music', 'music', 'Concerts and music festivals', TRUE, 3),
(gen_random_uuid(), 'Sports', 'sports', 'Sports events and tournaments', TRUE, 4),
(gen_random_uuid(), 'Food & Drink', 'food-drink', 'Food festivals and tastings', TRUE, 5)
ON CONFLICT (id) DO NOTHING;

-- System Settings
INSERT INTO system_settings (id, key, value, type, category, description) VALUES
(gen_random_uuid(), 'site_name', 'Eventify', 'string', 'general', 'Website name'),
(gen_random_uuid(), 'site_email', 'support@eventify.com', 'string', 'general', 'Support email'),
(gen_random_uuid(), 'currency', 'INR', 'string', 'general', 'Default currency'),
(gen_random_uuid(), 'platform_fee_percentage', '2.5', 'number', 'payment', 'Platform fee percentage'),
(gen_random_uuid(), 'gst_percentage', '18', 'number', 'payment', 'GST percentage'),
(gen_random_uuid(), 'organizer_commission', '90', 'number', 'payment', 'Organizer revenue share (%)'),
(gen_random_uuid(), 'enable_user_registration', 'true', 'boolean', 'security', 'Allow new user registration'),
(gen_random_uuid(), 'max_login_attempts', '5', 'number', 'security', 'Max failed login attempts before lockout'),
(gen_random_uuid(), 'session_timeout_minutes', '60', 'number', 'security', 'Session timeout in minutes')
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- COMPLETION
-- ============================================================================

SELECT 'Eventify Database Setup Complete!' as status;
SELECT 'Tables created: ' || COUNT(*)::text as table_count 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
