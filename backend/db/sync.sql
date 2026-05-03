DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('attendee', 'organizer', 'admin');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_status') THEN
    CREATE TYPE account_status AS ENUM ('pending', 'active', 'blocked', 'suspended');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
    CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_status') THEN
    CREATE TYPE event_status AS ENUM ('draft', 'published', 'cancelled', 'completed');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
    CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'refunded');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
    CREATE TYPE payment_status AS ENUM ('pending', 'success', 'failed', 'refunded', 'partially_refunded');
  END IF;
END $$;

ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'success';
ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'partially_refunded';

ALTER TABLE IF EXISTS payments ADD COLUMN IF NOT EXISTS provider VARCHAR(80) DEFAULT 'manual';
ALTER TABLE IF EXISTS payments ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(80);
ALTER TABLE IF EXISTS payments ADD COLUMN IF NOT EXISTS amount NUMERIC(10, 2) NOT NULL DEFAULT 0;
ALTER TABLE IF EXISTS payments ADD COLUMN IF NOT EXISTS payment_status payment_status NOT NULL DEFAULT 'success';
ALTER TABLE IF EXISTS payments ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;
ALTER TABLE IF EXISTS payments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE IF EXISTS venues ADD COLUMN IF NOT EXISTS organizer_id UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE IF EXISTS venues ADD COLUMN IF NOT EXISTS address TEXT;

ALTER TABLE IF EXISTS events ADD COLUMN IF NOT EXISTS banner_url TEXT;
ALTER TABLE IF EXISTS events ADD COLUMN IF NOT EXISTS base_price NUMERIC(10, 2) NOT NULL DEFAULT 0;
ALTER TABLE IF EXISTS events ADD COLUMN IF NOT EXISTS capacity INTEGER NOT NULL DEFAULT 0;
ALTER TABLE IF EXISTS events ADD COLUMN IF NOT EXISTS tickets_sold INTEGER NOT NULL DEFAULT 0;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'payments'
      AND column_name = 'status'
  ) THEN
    EXECUTE '
      UPDATE payments
      SET payment_status = CASE
        WHEN status::text = ''paid'' THEN ''success''::payment_status
        ELSE status::text::payment_status
      END
      WHERE payment_status IS NULL
    ';

    EXECUTE 'ALTER TABLE payments DROP COLUMN status';
  END IF;
END $$;

ALTER TABLE IF EXISTS users
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE IF EXISTS user_profiles
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

INSERT INTO user_profiles (user_id)
SELECT u.id
FROM users u
LEFT JOIN user_profiles up ON up.user_id = u.id
WHERE up.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'venues'
      AND column_name = 'address_line_1'
  ) THEN
    EXECUTE '
      UPDATE venues
      SET address = CONCAT_WS('', '', NULLIF(address_line_1, ''''), NULLIF(address_line_2, ''''))
      WHERE address IS NULL
    ';
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'events'
      AND column_name = 'banner_image_url'
  ) AND EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'events'
      AND column_name = 'cover_image_url'
  ) THEN
    EXECUTE '
      UPDATE events
      SET banner_url = COALESCE(NULLIF(banner_image_url, ''''), NULLIF(cover_image_url, ''''))
      WHERE banner_url IS NULL
    ';
  ELSIF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'events'
      AND column_name = 'banner_image_url'
  ) THEN
    EXECUTE '
      UPDATE events
      SET banner_url = NULLIF(banner_image_url, '''')
      WHERE banner_url IS NULL
    ';
  ELSIF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'events'
      AND column_name = 'cover_image_url'
  ) THEN
    EXECUTE '
      UPDATE events
      SET banner_url = NULLIF(cover_image_url, '''')
      WHERE banner_url IS NULL
    ';
  END IF;
END $$;
