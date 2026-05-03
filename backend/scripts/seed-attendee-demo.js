import bcrypt from 'bcryptjs';
import { pool } from '../src/config/db.js';

function parseSeedOptions(argv) {
  const options = {
    userId: '',
    email: '',
    name: '',
  };

  argv.forEach((arg) => {
    if (arg.startsWith('--userId=')) {
      options.userId = arg.split('=')[1]?.trim() || '';
    }

    if (arg.startsWith('--email=')) {
      options.email = arg.split('=')[1]?.trim() || '';
    }

    if (arg.startsWith('--name=')) {
      options.name = arg.split('=')[1]?.trim() || '';
    }
  });

  return options;
}

function buildBookingCode() {
  return `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')}`;
}

function buildPaymentReference() {
  return `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')}`;
}

async function ensureUserProfile(client, userId) {
  await client.query(
    `INSERT INTO user_profiles (user_id)
     VALUES ($1)
     ON CONFLICT (user_id) DO NOTHING`,
    [userId]
  );
}

async function getOrCreateUser(client, { name, email, role }) {
  const existing = await client.query(
    `SELECT id, full_name, email, role
     FROM users
     WHERE email = $1
     LIMIT 1`,
    [email]
  );

  if (existing.rowCount > 0) {
    await ensureUserProfile(client, existing.rows[0].id);
    return existing.rows[0];
  }

  const passwordHash = await bcrypt.hash('Demo@123', 10);
  const created = await client.query(
    `INSERT INTO users (full_name, email, password_hash, role, status)
     VALUES ($1, $2, $3, $4, 'active')
     RETURNING id, full_name, email, role`,
    [name, email, passwordHash, role]
  );

  await ensureUserProfile(client, created.rows[0].id);

  return created.rows[0];
}

async function resolveAttendee(client, options) {
  if (options.userId) {
    const byId = await client.query(
      `SELECT id, full_name, email, role
       FROM users
       WHERE id = $1
         AND role = 'attendee'
       LIMIT 1`,
      [options.userId]
    );

    if (byId.rowCount > 0) {
      await ensureUserProfile(client, byId.rows[0].id);
      return byId.rows[0];
    }
  }

  if (options.email) {
    const byEmail = await client.query(
      `SELECT id, full_name, email, role
       FROM users
       WHERE email = $1
         AND role = 'attendee'
       LIMIT 1`,
      [options.email]
    );

    if (byEmail.rowCount > 0) {
      await ensureUserProfile(client, byEmail.rows[0].id);
      return byEmail.rows[0];
    }
  }

  if (options.name) {
    const byName = await client.query(
      `SELECT id, full_name, email, role
       FROM users
       WHERE LOWER(full_name) = LOWER($1)
         AND role = 'attendee'
       ORDER BY created_at DESC
       LIMIT 1`,
      [options.name]
    );

    if (byName.rowCount > 0) {
      await ensureUserProfile(client, byName.rows[0].id);
      return byName.rows[0];
    }
  }

  const latestAttendee = await client.query(
    `SELECT id, full_name, email, role
     FROM users
     WHERE role = 'attendee'
     ORDER BY created_at DESC
     LIMIT 1`
  );

  if (latestAttendee.rowCount > 0) {
    await ensureUserProfile(client, latestAttendee.rows[0].id);
    return latestAttendee.rows[0];
  }

  return getOrCreateUser(client, {
    name: options.name || 'Mihir Mashru',
    email: options.email || `attendee.${Date.now()}@eventify.local`,
    role: 'attendee',
  });
}

async function getCategoryId(client, name) {
  const result = await client.query('SELECT id FROM categories WHERE name = $1 LIMIT 1', [name]);
  return result.rows[0]?.id || null;
}

async function getOrCreateVenue(client, organizerId) {
  const existing = await client.query(
    `SELECT id
     FROM venues
     WHERE managed_by = $1
       AND name = 'Eventify Convention Center'
     LIMIT 1`,
    [organizerId]
  );

  if (existing.rowCount > 0) {
    return existing.rows[0].id;
  }

  const created = await client.query(
    `INSERT INTO venues (managed_by, name, address, city, state, country)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id`,
    [organizerId, 'Eventify Convention Center', 'Riverfront Road', 'Ahmedabad', 'Gujarat', 'India']
  );

  return created.rows[0].id;
}

async function getOrCreateEvent(client, organizerId, venueId, event) {
  const existing = await client.query(
    `SELECT id
     FROM events
     WHERE organizer_id = $1
       AND title = $2
     LIMIT 1`,
    [organizerId, event.title]
  );

  if (existing.rowCount > 0) {
    return existing.rows[0].id;
  }

  const categoryId = await getCategoryId(client, event.categoryName);
  const created = await client.query(
    `INSERT INTO events (
       organizer_id,
       category_id,
       venue_id,
       title,
       description,
       start_at,
       end_at,
       status,
       banner_url,
       base_price,
       max_attendees
     )
     VALUES ($1, $2, $3, $4, $5, NOW() + ($6 || ' days')::interval, NOW() + ($7 || ' days')::interval, 'published', $8, $9, $10)
     RETURNING id`,
    [
      organizerId,
      categoryId,
      venueId,
      event.title,
      event.description || event.shortDescription,
      String(event.startInDays),
      String(event.endInDays),
      event.bannerUrl,
      event.basePrice,
      event.capacity,
    ]
  );

  return created.rows[0].id;
}

async function ensureBooking(client, attendeeId, eventId, status, totalAmount) {
  const existing = await client.query(
    `SELECT id
     FROM bookings
     WHERE user_id = $1
       AND event_id = $2
     LIMIT 1`,
    [attendeeId, eventId]
  );

  if (existing.rowCount > 0) {
    return existing.rows[0].id;
  }

  const created = await client.query(
    `INSERT INTO bookings (booking_reference, event_id, user_id, status, total_amount)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [buildBookingCode(), eventId, attendeeId, status, totalAmount]
  );

  return created.rows[0].id;
}

async function ensurePayment(client, bookingId, amount, paymentStatus = 'success', provider = 'upi') {
  if (Number(amount) <= 0) {
    return;
  }

  const existing = await client.query(
    `SELECT id
     FROM payments
     WHERE booking_id = $1
     LIMIT 1`,
    [bookingId]
  );

  if (existing.rowCount > 0) {
    return;
  }

  await client.query(
    `INSERT INTO payments (
       booking_id,
       provider,
       payment_reference,
       amount,
       payment_status,
       paid_at
     )
     VALUES ($1, $2, $3, $4, $5, NOW())`,
    [bookingId, provider, buildPaymentReference(), amount, paymentStatus]
  );
}

async function ensureNotification(client, userId, title, message, type = 'general') {
  const existing = await client.query(
    `SELECT id
     FROM notifications
     WHERE user_id = $1
       AND title = $2
       AND message = $3
     LIMIT 1`,
    [userId, title, message]
  );

  if (existing.rowCount > 0) {
    return;
  }

  await client.query(
    `INSERT INTO notifications (user_id, title, message, type)
     VALUES ($1, $2, $3, $4)`,
    [userId, title, message, type]
  );
}

async function run() {
  const options = parseSeedOptions(process.argv.slice(2));
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const attendee = await resolveAttendee(client, options);

    const organizer =
      (await client.query(
        `SELECT id, full_name, email, role
         FROM users
         WHERE role = 'organizer'
         ORDER BY created_at ASC
         LIMIT 1`
      )).rows[0] ||
      (await getOrCreateUser(client, {
        name: 'Eventify Organizer',
        email: 'organizer@eventify.local',
        role: 'organizer',
      }));

    await client.query(
      `INSERT INTO organizer_applications (
         user_id,
         organization_name,
         business_type,
         contact_email,
         description,
         status,
         reviewed_at
       )
       VALUES ($1, $2, $3, $4, $5, 'approved', NOW())
       ON CONFLICT (user_id) DO UPDATE
       SET status = 'approved',
           reviewed_at = NOW()`,
      [
        organizer.id,
        'Eventify Live',
        'Events',
        organizer.email,
        'Demo organizer account for attendee dashboard seed data.',
      ]
    );

    const venueId = await getOrCreateVenue(client, organizer.id);

    const events = [
      {
        title: 'Mihir Mashru Live',
        categoryName: 'Business',
        shortDescription: 'Leadership and networking for ambitious professionals.',
        description: 'A flagship leadership and networking event.',
        startInDays: 8,
        endInDays: 8.25,
        bannerUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
        basePrice: 899,
        capacity: 220,
        ticketsSold: 132,
        refundPolicy: 'Full refund up to 48 hours before the event.',
      },
      {
        title: 'Modern Art Exhibition',
        categoryName: 'Arts',
        shortDescription: 'A contemporary art showcase with guided sessions.',
        description: 'An immersive contemporary art showcase.',
        startInDays: 22,
        endInDays: 22.2,
        bannerUrl: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=1200&q=80',
        basePrice: 0,
        capacity: 150,
        ticketsSold: 78,
        refundPolicy: 'Free-entry event, no refund needed.',
      },
      {
        title: 'Jazz Night Live',
        categoryName: 'Music',
        shortDescription: 'A premium live music evening with featured artists.',
        description: 'An evening of live jazz performances.',
        startInDays: 34,
        endInDays: 34.25,
        bannerUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
        basePrice: 1299,
        capacity: 400,
        ticketsSold: 260,
        refundPolicy: 'Refund available up to 72 hours before the event.',
      },
    ];

    const eventIds = [];
    for (const event of events) {
      const eventId = await getOrCreateEvent(client, organizer.id, venueId, event);
      eventIds.push(eventId);
    }

    const bookingOneId = await ensureBooking(client, attendee.id, eventIds[0], 'confirmed', 899);
    await ensureBooking(client, attendee.id, eventIds[1], 'confirmed', 0);
    const bookingThreeId = await ensureBooking(client, attendee.id, eventIds[2], 'cancelled', 1299);

    await ensurePayment(client, bookingOneId, 899, 'success', 'upi');
    await ensurePayment(client, bookingThreeId, 1299, 'refunded', 'card');

    await client.query(
      `INSERT INTO wishlists (user_id, event_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, event_id) DO NOTHING`,
      [attendee.id, eventIds[2]]
    );

    await ensureNotification(
      client,
      attendee.id,
      'Booking Confirmed',
      `Your booking for ${events[0].title} is confirmed.`,
      'booking'
    );
    await ensureNotification(
      client,
      attendee.id,
      'Event Reminder',
      `${events[1].title} is coming up soon.`,
      'reminder'
    );
    await ensureNotification(
      client,
      attendee.id,
      'Refund Processed',
      `Refund for ${events[2].title} has been initiated.`,
      'payment'
    );

    await client.query('COMMIT');
    console.log(`Attendee demo data seeded for ${attendee.email} (${attendee.id}).`);
    console.log('If you need to log in with the created demo attendee, use password: Demo@123');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((error) => {
  console.error('Attendee demo seed failed:', error.message);
  process.exit(1);
});
