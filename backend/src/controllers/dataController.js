import bcrypt from 'bcryptjs';
import { query, pool } from '../config/db.js';
import { toDbRole, toFrontendRole } from '../utils/roles.js';

function formatCurrencyValue(value) {
  return Number(value || 0);
}

function mapUser(row) {
  return {
    id: row.id,
    name: row.full_name,
    email: row.email,
    role: toFrontendRole(row.role),
    dbRole: row.role,
    status: row.status,
    joinDate: row.created_at,
    bookings: Number(row.bookings_count || 0),
  };
}

function mapEvent(row) {
  const sold = Number(row.tickets_sold || 0);
  const capacity = Number(row.capacity || 0);

  return {
    id: row.id,
    organizerId: row.organizer_id,
    title: row.title,
    description: row.description || '',
    category: row.category_name || 'Uncategorized',
    location: row.venue_label || 'Online',
    venue: row.venue_name || row.venue_label || 'Online',
    date: row.start_at,
    endDate: row.end_at,
    status: row.status,
    image: row.banner_url || '',
    price: formatCurrencyValue(row.base_price),
    ticketsSold: sold,
    capacity,
    revenue: formatCurrencyValue(row.revenue),
    rating: Number(row.rating || 0),
    reviews: Number(row.reviews_count || 0),
    wishlisted: Boolean(row.wishlisted),
    refundPolicy: row.refund_policy || '',
    progressPercent: capacity > 0 ? Math.round((sold / capacity) * 100) : 0,
  };
}

function buildEventFilters({ search, category, organizerId }) {
  const where = [];
  const values = [];

  if (organizerId) {
    values.push(organizerId);
    where.push(`e.organizer_id = $${values.length}`);
  }

  if (category && category !== 'All') {
    values.push(category);
    where.push(`c.name = $${values.length}`);
  }

  if (search) {
    values.push(`%${search.toLowerCase()}%`);
    where.push(
      `(LOWER(e.title) LIKE $${values.length} OR LOWER(COALESCE(v.name, '')) LIKE $${values.length} OR LOWER(COALESCE(v.city, '')) LIKE $${values.length})`
    );
  }

  return {
    values,
    whereClause: where.length ? `WHERE ${where.join(' AND ')}` : '',
  };
}

async function findOrCreateCategory(client, categoryName) {
  const name = (categoryName || 'General').trim() || 'General';
  const existing = await client.query(
    `SELECT id, name
     FROM categories
     WHERE LOWER(name) = LOWER($1)
     ORDER BY created_at ASC
     LIMIT 1`,
    [name]
  );

  if (existing.rowCount > 0) {
    return existing.rows[0];
  }

  try {
    const created = await client.query(
      `INSERT INTO categories (name)
       VALUES ($1)
       RETURNING id, name`,
      [name]
    );

    return created.rows[0];
  } catch (error) {
    if (error.code !== '23505') {
      throw error;
    }

    const existingAfterConflict = await client.query(
      `SELECT id, name
       FROM categories
       WHERE LOWER(name) = LOWER($1)
       ORDER BY created_at ASC
       LIMIT 1`,
      [name]
    );

    return existingAfterConflict.rows[0];
  }
}

export async function getEventCategories(_req, res) {
  const result = await query('SELECT id, name FROM categories ORDER BY name ASC');

  res.json({
    categories: result.rows.map((row) => ({
      id: row.id,
      name: row.name,
    })),
  });
}

export async function listEvents(req, res) {
  const { search = '', category = '', organizerId = '', userId = '' } = req.query;
  const { values, whereClause } = buildEventFilters({ search, category, organizerId });
  const viewerSql = userId
    ? `EXISTS (
         SELECT 1
         FROM wishlists w
         WHERE w.event_id = e.id
           AND w.user_id = $${values.length + 1}
       ) AS wishlisted`
    : 'FALSE AS wishlisted';

  if (userId) {
    values.push(userId);
  }

  const result = await query(
    `SELECT
       e.id,
       e.organizer_id,
       e.title,
       e.description,
       e.start_at,
       e.end_at,
       e.status,
       e.banner_url,
       e.base_price,
       e.capacity,
       e.tickets_sold,
       e.refund_policy,
       c.name AS category_name,
       v.name AS venue_name,
       CONCAT_WS(', ', NULLIF(v.name, ''), NULLIF(v.city, ''), NULLIF(v.state, '')) AS venue_label,
       COALESCE(AVG(r.rating), 0) AS rating,
       COUNT(DISTINCT r.id) AS reviews_count,
       COALESCE(SUM(CASE WHEN b.status = 'confirmed' THEN b.total_amount ELSE 0 END), 0) AS revenue,
       ${viewerSql}
     FROM events e
     LEFT JOIN categories c ON c.id = e.category_id
     LEFT JOIN venues v ON v.id = e.venue_id
     LEFT JOIN reviews r ON r.event_id = e.id
     LEFT JOIN bookings b ON b.event_id = e.id
     ${whereClause}
     GROUP BY e.id, c.name, v.name, v.city, v.state
     ORDER BY e.start_at ASC`,
    values
  );

  res.json({
    events: result.rows.map(mapEvent),
  });
}

export async function createEvent(req, res) {
  const {
    organizerId,
    title,
    description,
    date,
    time,
    category,
    venue,
    ticketPrice = 0,
    quantity = 0,
    refundPolicy = '',
    bannerUrl = '',
    status = 'draft',
  } = req.body;

  if (!organizerId || !title || !date) {
    return res.status(400).json({ message: 'Organizer, title, and date are required.' });
  }

  const startAt = new Date(`${date}T${time || '00:00'}:00`);
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const categoryRecord = await findOrCreateCategory(client, category);
    const venueName = (venue || 'Online').trim() || 'Online';
    const venueResult = await client.query(
      `INSERT INTO venues (organizer_id, name, address, city, state)
       VALUES ($1, $2, $3, NULL, NULL)
       RETURNING id`,
      [organizerId, venueName, venueName]
    );

    const eventResult = await client.query(
      `INSERT INTO events (
         organizer_id,
         category_id,
         venue_id,
         title,
         description,
         start_at,
         status,
         banner_url,
         base_price,
         capacity,
         refund_policy
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id`,
      [
        organizerId,
        categoryRecord.id,
        venueResult.rows[0].id,
        title.trim(),
        description || '',
        startAt.toISOString(),
        status,
        bannerUrl || '',
        Number(ticketPrice) || 0,
        Number(quantity) || 0,
        refundPolicy || '',
      ]
    );

    await client.query(
      `INSERT INTO ticket_types (event_id, name, price, quantity, is_early_bird)
       VALUES ($1, $2, $3, $4, FALSE)`,
      [eventResult.rows[0].id, 'General Admission', Number(ticketPrice) || 0, Number(quantity) || 0]
    );

    const createdEvent = await client.query(
      `SELECT
         e.id,
         e.organizer_id,
         e.title,
         e.description,
         e.start_at,
         e.end_at,
         e.status,
         e.banner_url,
         e.base_price,
         e.capacity,
         e.tickets_sold,
         e.refund_policy,
         c.name AS category_name,
         v.name AS venue_name,
         CONCAT_WS(', ', NULLIF(v.name, ''), NULLIF(v.city, ''), NULLIF(v.state, '')) AS venue_label,
         0 AS rating,
         0 AS reviews_count,
         0 AS revenue,
         FALSE AS wishlisted
       FROM events e
       LEFT JOIN categories c ON c.id = e.category_id
       LEFT JOIN venues v ON v.id = e.venue_id
       WHERE e.id = $1`,
      [eventResult.rows[0].id]
    );

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Event saved successfully.',
      event: mapEvent(createdEvent.rows[0]),
    });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function updateEvent(req, res) {
  const { id } = req.params;
  const {
    title,
    description,
    date,
    time,
    category,
    venue,
    ticketPrice = 0,
    quantity = 0,
    refundPolicy = '',
    bannerUrl = '',
    status = 'draft',
  } = req.body;

  const current = await query('SELECT organizer_id FROM events WHERE id = $1', [id]);

  if (current.rowCount === 0) {
    return res.status(404).json({ message: 'Event not found.' });
  }

  const startAt = new Date(`${date}T${time || '00:00'}:00`);
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const categoryRecord = await findOrCreateCategory(client, category);
    const venueName = (venue || 'Online').trim() || 'Online';
    const venueResult = await client.query(
      `INSERT INTO venues (organizer_id, name, address, city, state)
       VALUES ($1, $2, $3, NULL, NULL)
       RETURNING id`,
      [current.rows[0].organizer_id, venueName, venueName]
    );

    await client.query(
      `UPDATE events
       SET category_id = $2,
           venue_id = $3,
           title = $4,
           description = $5,
           start_at = $6,
           status = $7,
           banner_url = $8,
           base_price = $9,
           capacity = $10,
           refund_policy = $11,
           updated_at = NOW()
       WHERE id = $1`,
      [
        id,
        categoryRecord.id,
        venueResult.rows[0].id,
        title.trim(),
        description || '',
        startAt.toISOString(),
        status,
        bannerUrl || '',
        Number(ticketPrice) || 0,
        Number(quantity) || 0,
        refundPolicy || '',
      ]
    );

    const ticketUpdate = await client.query(
      `UPDATE ticket_types
       SET price = $2, quantity = $3
       WHERE id = (
         SELECT id
         FROM ticket_types
         WHERE event_id = $1
         ORDER BY created_at ASC
         LIMIT 1
       )`,
      [id, Number(ticketPrice) || 0, Number(quantity) || 0]
    );

    if (ticketUpdate.rowCount === 0) {
      await client.query(
        `INSERT INTO ticket_types (event_id, name, price, quantity, is_early_bird)
         VALUES ($1, 'General Admission', $2, $3, FALSE)`,
        [id, Number(ticketPrice) || 0, Number(quantity) || 0]
      );
    }

    await client.query('COMMIT');

    res.json({ message: 'Event updated successfully.' });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteEvent(req, res) {
  const { id } = req.params;
  const result = await query('DELETE FROM events WHERE id = $1', [id]);

  if (result.rowCount === 0) {
    return res.status(404).json({ message: 'Event not found.' });
  }

  res.json({ message: 'Event deleted successfully.' });
}

export async function getAttendeeDashboard(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'User id is required.' });
  }

  const [statsResult, upcomingResult, recommendedResult] = await Promise.all([
    query(
      `SELECT
         COUNT(*) FILTER (WHERE b.status = 'confirmed') AS total_bookings,
         COUNT(*) FILTER (WHERE b.status = 'cancelled') AS cancelled_bookings,
         COUNT(*) FILTER (WHERE e.start_at >= NOW() AND b.status = 'confirmed') AS upcoming_events,
         (SELECT COUNT(*) FROM wishlists w WHERE w.user_id = $1) AS saved_events
       FROM bookings b
       LEFT JOIN events e ON e.id = b.event_id
       WHERE b.user_id = $1`,
      [userId]
    ),
    query(
      `SELECT
         e.id,
         e.organizer_id,
         e.title,
         e.description,
         e.start_at,
         e.end_at,
         e.status,
         e.banner_url,
         e.base_price,
         e.capacity,
         e.tickets_sold,
         e.refund_policy,
         c.name AS category_name,
         v.name AS venue_name,
         CONCAT_WS(', ', NULLIF(v.name, ''), NULLIF(v.city, ''), NULLIF(v.state, '')) AS venue_label,
         COALESCE(AVG(r.rating), 0) AS rating,
         COUNT(DISTINCT r.id) AS reviews_count,
         COALESCE(SUM(CASE WHEN b.status = 'confirmed' THEN b.total_amount ELSE 0 END), 0) AS revenue,
         EXISTS (
           SELECT 1
           FROM wishlists w
           WHERE w.event_id = e.id
             AND w.user_id = $1
         ) AS wishlisted
       FROM bookings b0
       JOIN events e ON e.id = b0.event_id
       LEFT JOIN categories c ON c.id = e.category_id
       LEFT JOIN venues v ON v.id = e.venue_id
       LEFT JOIN reviews r ON r.event_id = e.id
       LEFT JOIN bookings b ON b.event_id = e.id
       WHERE b0.user_id = $1
         AND e.start_at >= NOW()
       GROUP BY e.id, c.name, v.name, v.city, v.state
       ORDER BY e.start_at ASC
       LIMIT 3`,
      [userId]
    ),
    query(
      `SELECT
         e.id,
         e.organizer_id,
         e.title,
         e.description,
         e.start_at,
         e.end_at,
         e.status,
         e.banner_url,
         e.base_price,
         e.capacity,
         e.tickets_sold,
         e.refund_policy,
         c.name AS category_name,
         v.name AS venue_name,
         CONCAT_WS(', ', NULLIF(v.name, ''), NULLIF(v.city, ''), NULLIF(v.state, '')) AS venue_label,
         COALESCE(AVG(r.rating), 0) AS rating,
         COUNT(DISTINCT r.id) AS reviews_count,
         COALESCE(SUM(CASE WHEN b.status = 'confirmed' THEN b.total_amount ELSE 0 END), 0) AS revenue,
         EXISTS (
           SELECT 1
           FROM wishlists w
           WHERE w.event_id = e.id
             AND w.user_id = $1
         ) AS wishlisted
       FROM events e
       LEFT JOIN categories c ON c.id = e.category_id
       LEFT JOIN venues v ON v.id = e.venue_id
       LEFT JOIN reviews r ON r.event_id = e.id
       LEFT JOIN bookings b ON b.event_id = e.id
       WHERE e.status = 'published'
         AND e.start_at >= NOW()
       GROUP BY e.id, c.name, v.name, v.city, v.state
       ORDER BY rating DESC, e.start_at ASC
       LIMIT 3`,
      [userId]
    ),
  ]);

  res.json({
    stats: {
      totalBookings: Number(statsResult.rows[0]?.total_bookings || 0),
      cancelled: Number(statsResult.rows[0]?.cancelled_bookings || 0),
      upcomingEvents: Number(statsResult.rows[0]?.upcoming_events || 0),
      savedEvents: Number(statsResult.rows[0]?.saved_events || 0),
    },
    upcomingEvents: upcomingResult.rows.map(mapEvent),
    recommendedEvents: recommendedResult.rows.map(mapEvent),
  });
}

export async function toggleWishlist(req, res) {
  const { userId, eventId } = req.body;

  if (!userId || !eventId) {
    return res.status(400).json({ message: 'User and event are required.' });
  }

  const existing = await query(
    'SELECT 1 FROM wishlists WHERE user_id = $1 AND event_id = $2',
    [userId, eventId]
  );

  if (existing.rowCount > 0) {
    await query('DELETE FROM wishlists WHERE user_id = $1 AND event_id = $2', [userId, eventId]);
    return res.json({ wishlisted: false, message: 'Removed from wishlist.' });
  }

  await query(
    `INSERT INTO wishlists (user_id, event_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, event_id) DO NOTHING`,
    [userId, eventId]
  );

  return res.json({ wishlisted: true, message: 'Added to wishlist.' });
}

export async function listAttendeeBookings(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'User id is required.' });
  }

  const result = await query(
    `SELECT
       b.id,
       b.booking_reference,
       b.status,
       b.total_amount,
       e.title,
       e.start_at,
       e.end_at,
       e.banner_url,
       c.name AS category_name,
       CONCAT_WS(', ', NULLIF(v.name, ''), NULLIF(v.city, ''), NULLIF(v.state, '')) AS venue_label,
       COALESCE(SUM(bi.quantity), 1) AS quantity,
       COALESCE(MAX(tt.name), 'Regular') AS ticket_type
     FROM bookings b
     JOIN events e ON e.id = b.event_id
     LEFT JOIN categories c ON c.id = e.category_id
     LEFT JOIN venues v ON v.id = e.venue_id
     LEFT JOIN booking_items bi ON bi.booking_id = b.id
     LEFT JOIN ticket_types tt ON tt.id = bi.ticket_type_id
     WHERE b.user_id = $1
     GROUP BY b.id, b.booking_reference, b.status, b.total_amount, e.title, e.start_at, e.end_at, e.banner_url, c.name, v.name, v.city, v.state
     ORDER BY e.start_at DESC`,
    [userId]
  );

  res.json({
    bookings: result.rows.map((row) => ({
      bookingId: row.id,
      id: row.booking_reference || row.id,
      status: row.status,
      title: row.title,
      category: row.category_name || 'General',
      date: row.start_at,
      endDate: row.end_at,
      location: row.venue_label || 'Online',
      accessType: `${row.ticket_type || 'Regular'} Access`,
      purchaseQuantity: Number(row.quantity || 1),
      ticketType: row.ticket_type || 'Regular',
      totalAmount: Number(row.total_amount || 0),
      image: row.banner_url || '',
    })),
  });
}

export async function cancelAttendeeBooking(req, res) {
  const { id } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User id is required.' });
  }

  const result = await query(
    `UPDATE bookings
     SET status = 'cancelled',
         updated_at = NOW()
     WHERE id = $1
       AND user_id = $2
       AND status IN ('pending', 'confirmed')
     RETURNING id, booking_reference, status`,
    [id, userId]
  );

  if (result.rowCount === 0) {
    return res.status(400).json({ message: 'Booking cannot be canceled.' });
  }

  return res.json({
    message: 'Booking canceled successfully.',
    booking: {
      bookingId: result.rows[0].id,
      id: result.rows[0].booking_reference || result.rows[0].id,
      status: result.rows[0].status,
    },
  });
}

export async function listAttendeePayments(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'User id is required.' });
  }

  const [paymentsResult, freeBookingsResult] = await Promise.all([
    query(
      `SELECT
         p.id,
         p.payment_reference,
         p.provider,
         p.amount,
         p.payment_status,
         p.paid_at,
         p.created_at,
         b.booking_reference,
         e.title AS event_title,
         COALESCE(SUM(bi.quantity), 1) AS quantity,
         COALESCE(MAX(tt.name), 'Regular') AS ticket_type
       FROM payments p
       JOIN bookings b ON b.id = p.booking_id
       JOIN events e ON e.id = b.event_id
       LEFT JOIN booking_items bi ON bi.booking_id = b.id
       LEFT JOIN ticket_types tt ON tt.id = bi.ticket_type_id
       WHERE b.user_id = $1
       GROUP BY p.id, p.payment_reference, p.provider, p.amount, p.payment_status, p.paid_at, p.created_at, b.booking_reference, e.title
       ORDER BY COALESCE(p.paid_at, p.created_at) DESC`,
      [userId]
    ),
    query(
      `SELECT COUNT(*) AS free_bookings
       FROM bookings b
       WHERE b.user_id = $1
         AND b.total_amount = 0`,
      [userId]
    ),
  ]);

  const totalPaid = paymentsResult.rows.reduce((sum, row) => {
    return row.payment_status === 'success' ? sum + Number(row.amount || 0) : sum;
  }, 0);

  const successfulTransactions = paymentsResult.rows.filter(
    (row) => row.payment_status === 'success'
  ).length;

  res.json({
    summary: {
      totalPaid,
      successfulTransactions,
      freeBookings: Number(freeBookingsResult.rows[0]?.free_bookings || 0),
    },
    transactions: paymentsResult.rows.map((row) => ({
      id: row.id,
      transactionId: row.payment_reference || row.id,
      bookingId: row.booking_reference,
      date: row.paid_at || row.created_at,
      event: row.event_title,
      ticket: row.ticket_type,
      quantity: Number(row.quantity || 1),
      amount: Number(row.amount || 0),
      method: row.provider || 'manual',
      status: row.payment_status,
    })),
  });
}

export async function listAttendeeWishlist(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'User id is required.' });
  }

  const result = await query(
    `SELECT
       e.id,
       e.title,
       e.start_at,
       e.banner_url,
       e.base_price,
       c.name AS category_name,
       CONCAT_WS(', ', NULLIF(v.name, ''), NULLIF(v.city, ''), NULLIF(v.state, '')) AS venue_label,
       COALESCE(AVG(r.rating), 0) AS rating,
       COUNT(DISTINCT r.id) AS reviews_count
     FROM wishlists w
     JOIN events e ON e.id = w.event_id
     LEFT JOIN categories c ON c.id = e.category_id
     LEFT JOIN venues v ON v.id = e.venue_id
     LEFT JOIN reviews r ON r.event_id = e.id
     WHERE w.user_id = $1
     GROUP BY e.id, c.name, v.name, v.city, v.state, w.created_at
     ORDER BY w.created_at DESC`,
    [userId]
  );

  res.json({
    events: result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      category: row.category_name || 'General',
      date: row.start_at,
      location: row.venue_label || 'Online',
      rating: Number(row.rating || 0),
      reviewsCount: Number(row.reviews_count || 0),
      price: Number(row.base_price || 0),
      image: row.banner_url || '',
    })),
  });
}

export async function listAttendeeNotifications(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'User id is required.' });
  }

  const result = await query(
    `SELECT id, title, message, type, is_read, created_at
     FROM notifications
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );

  res.json({
    notifications: result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      message: row.message,
      type: row.type || 'general',
      isRead: Boolean(row.is_read),
      createdAt: row.created_at,
    })),
  });
}

export async function markNotificationAsRead(req, res) {
  const { id } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User id is required.' });
  }

  const result = await query(
    `UPDATE notifications
     SET is_read = TRUE
     WHERE id = $1
       AND user_id = $2
     RETURNING id`,
    [id, userId]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ message: 'Notification not found.' });
  }

  return res.json({ message: 'Notification marked as read.' });
}

export async function markAllNotificationsAsRead(req, res) {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User id is required.' });
  }

  await query(
    `UPDATE notifications
     SET is_read = TRUE
     WHERE user_id = $1`,
    [userId]
  );

  return res.json({ message: 'All notifications marked as read.' });
}

export async function listAttendeeReviews(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'User id is required.' });
  }

  const [reviewsResult, pendingResult] = await Promise.all([
    query(
      `SELECT
         r.id,
         r.event_id,
         r.rating,
         r.comment,
         r.created_at,
         e.title,
         e.banner_url
       FROM reviews r
       JOIN events e ON e.id = r.event_id
       WHERE r.user_id = $1
       ORDER BY r.created_at DESC`,
      [userId]
    ),
    query(
      `SELECT
         e.id,
         e.title,
         e.banner_url,
         COALESCE(e.end_at, e.start_at) AS attended_at
       FROM bookings b
       JOIN events e ON e.id = b.event_id
       WHERE b.user_id = $1
         AND b.status = 'confirmed'
         AND COALESCE(e.end_at, e.start_at) < NOW()
         AND NOT EXISTS (
           SELECT 1
           FROM reviews r
           WHERE r.user_id = $1
             AND r.event_id = e.id
         )
       GROUP BY e.id
       ORDER BY attended_at DESC`,
      [userId]
    ),
  ]);

  res.json({
    reviews: reviewsResult.rows.map((row) => ({
      id: row.id,
      eventId: row.event_id,
      title: row.title,
      rating: Number(row.rating || 0),
      text: row.comment || '',
      date: row.created_at,
      image: row.banner_url || '',
    })),
    pendingReviews: pendingResult.rows.map((row) => ({
      id: row.id,
      title: row.title,
      image: row.banner_url || '',
      attendedAt: row.attended_at,
    })),
  });
}

export async function createAttendeeReview(req, res) {
  const { userId, eventId, rating, text = '' } = req.body;

  if (!userId || !eventId || !rating) {
    return res.status(400).json({ message: 'User, event, and rating are required.' });
  }

  const bookingCheck = await query(
    `SELECT 1
     FROM bookings b
     JOIN events e ON e.id = b.event_id
     WHERE b.user_id = $1
       AND b.event_id = $2
       AND b.status = 'confirmed'
       AND COALESCE(e.end_at, e.start_at) < NOW()
     LIMIT 1`,
    [userId, eventId]
  );

  if (bookingCheck.rowCount === 0) {
    return res.status(400).json({ message: 'You can review only attended events.' });
  }

  const result = await query(
    `INSERT INTO reviews (event_id, user_id, rating, comment)
     VALUES ($1, $2, $3, $4)
     RETURNING id, event_id, rating, comment, created_at`,
    [eventId, userId, Number(rating), text.trim()]
  );

  return res.status(201).json({
    message: 'Review created successfully.',
    review: {
      id: result.rows[0].id,
      eventId: result.rows[0].event_id,
      rating: Number(result.rows[0].rating || 0),
      text: result.rows[0].comment || '',
      date: result.rows[0].created_at,
    },
  });
}

export async function updateAttendeeReview(req, res) {
  const { id } = req.params;
  const { userId, rating, text = '' } = req.body;

  if (!userId || !rating) {
    return res.status(400).json({ message: 'User and rating are required.' });
  }

  const result = await query(
    `UPDATE reviews
     SET rating = $3,
         comment = $4
     WHERE id = $1
       AND user_id = $2
     RETURNING id, event_id, rating, comment, created_at`,
    [id, userId, Number(rating), text.trim()]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ message: 'Review not found.' });
  }

  return res.json({
    message: 'Review updated successfully.',
    review: {
      id: result.rows[0].id,
      eventId: result.rows[0].event_id,
      rating: Number(result.rows[0].rating || 0),
      text: result.rows[0].comment || '',
      date: result.rows[0].created_at,
    },
  });
}

export async function deleteAttendeeReview(req, res) {
  const { id } = req.params;
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'User id is required.' });
  }

  const result = await query(
    `DELETE FROM reviews
     WHERE id = $1
       AND user_id = $2
     RETURNING id`,
    [id, userId]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ message: 'Review not found.' });
  }

  return res.json({ message: 'Review deleted successfully.' });
}

export async function getAttendeeProfile(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'User id is required.' });
  }

  const result = await query(
    `SELECT
       u.id,
       u.full_name,
       u.email,
       u.phone,
       u.avatar_url,
       up.city,
       up.state,
       up.country
     FROM users u
     LEFT JOIN user_profiles up ON up.user_id = u.id
     WHERE u.id = $1
     LIMIT 1`,
    [userId]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const row = result.rows[0];
  const baseUrl = process.env.CLIENT_URL?.replace('/api', '') || 'http://localhost:5000';
  const photoUrl = row.avatar_url ? `${baseUrl}${row.avatar_url}` : '';

  console.log('DB avatar_url:', row.avatar_url);
  console.log('Generated photoUrl:', photoUrl);

  return res.json({
    profile: {
      id: row.id,
      name: row.full_name,
      email: row.email,
      phone: row.phone || '',
      location: [row.city, row.state].filter(Boolean).join(', '),
      photo: photoUrl,
      dob: '',
      bio: '',
    },
  });
}

export async function updateAttendeeProfile(req, res) {
  const { userId, name, email, phone = '', location = '' } = req.body;

  if (!userId || !name || !email) {
    return res.status(400).json({ message: 'User, name, and email are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const [city = '', state = ''] = location
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  const duplicate = await query(
    `SELECT id
     FROM users
     WHERE email = $1
       AND id <> $2
     LIMIT 1`,
    [normalizedEmail, userId]
  );

  if (duplicate.rowCount > 0) {
    return res.status(409).json({ message: 'Email already in use by another account.' });
  }

  await query(
    `UPDATE users
     SET full_name = $2,
         email = $3,
         phone = $4,
         updated_at = NOW()
     WHERE id = $1`,
    [userId, name.trim(), normalizedEmail, phone.trim()]
  );

  await query(
    `INSERT INTO user_profiles (user_id, city, state)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id)
     DO UPDATE SET
       city = EXCLUDED.city,
       state = EXCLUDED.state,
       updated_at = NOW()`,
    [userId, city || null, state || null]
  );

  return res.json({ message: 'Profile updated successfully.' });
}

export async function updateAttendeePassword(req, res) {
  const { userId, currentPassword, newPassword } = req.body;

  if (!userId || !currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: 'User, current password, and new password are required.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters.' });
  }

  const userResult = await query(
    `SELECT id, password_hash
     FROM users
     WHERE id = $1
     LIMIT 1`,
    [userId]
  );

  if (userResult.rowCount === 0) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const isValidPassword = await bcrypt.compare(currentPassword, userResult.rows[0].password_hash);

  if (!isValidPassword) {
    return res.status(400).json({ message: 'Current password is incorrect.' });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await query(
    `UPDATE users
     SET password_hash = $2,
         updated_at = NOW()
     WHERE id = $1`,
    [userId, passwordHash]
  );

  return res.json({ message: 'Password updated successfully.' });
}

export async function getOrganizerDashboard(req, res) {
  const { organizerId } = req.query;

  if (!organizerId) {
    return res.status(400).json({ message: 'Organizer id is required.' });
  }

  const [statsResult, activityResult, chartResult] = await Promise.all([
    query(
      `WITH organizer_events AS (
         SELECT id, capacity
         FROM events
         WHERE organizer_id = $1
       ),
       booking_totals AS (
         SELECT
           b.id,
           b.event_id,
           b.status,
           COALESCE(SUM(bi.quantity), 0) AS quantity,
           COALESCE(MAX(p.amount), MAX(b.total_amount), 0) AS amount
         FROM bookings b
         LEFT JOIN booking_items bi ON bi.booking_id = b.id
         LEFT JOIN payments p ON p.booking_id = b.id AND p.payment_status = 'success'
         WHERE b.event_id IN (SELECT id FROM organizer_events)
         GROUP BY b.id
       )
       SELECT
         (SELECT COUNT(*) FROM organizer_events) AS total_events,
         COALESCE(SUM(quantity) FILTER (WHERE status IN ('confirmed', 'pending')), 0) AS tickets_sold,
         COALESCE(SUM(amount) FILTER (WHERE status IN ('confirmed', 'pending')), 0) AS total_revenue,
         CASE
           WHEN COALESCE((SELECT SUM(capacity) FROM organizer_events), 0) = 0 THEN 0
           ELSE ROUND(
             (COALESCE(SUM(quantity) FILTER (WHERE status IN ('confirmed', 'pending')), 0)::NUMERIC
              / NULLIF((SELECT SUM(capacity) FROM organizer_events), 0)) * 100,
             1
           )
         END AS conversion_rate
       FROM booking_totals`,
      [organizerId]
    ),
    query(
      `SELECT
         b.id,
         e.title AS event_title,
         u.full_name AS user_name,
         bi.quantity,
         p.amount,
         p.paid_at,
         p.payment_status AS status
       FROM bookings b
       JOIN events e ON e.id = b.event_id
       JOIN users u ON u.id = b.user_id
       LEFT JOIN booking_items bi ON bi.booking_id = b.id
       LEFT JOIN payments p ON p.booking_id = b.id
       WHERE e.organizer_id = $1
       ORDER BY COALESCE(p.paid_at, b.created_at) DESC
       LIMIT 6`,
      [organizerId]
    ),
    query(
      `SELECT
         EXTRACT(ISODOW FROM COALESCE(p.paid_at, b.created_at))::INTEGER AS day_number,
         COALESCE(SUM(bi.quantity), 0) AS sales,
         COALESCE(SUM(CASE WHEN p.payment_status = 'success' THEN p.amount ELSE 0 END), 0) AS revenue,
         COUNT(DISTINCT b.user_id) AS visitors
       FROM bookings b
       JOIN events e ON e.id = b.event_id
       LEFT JOIN booking_items bi ON bi.booking_id = b.id
       LEFT JOIN payments p ON p.booking_id = b.id
       WHERE e.organizer_id = $1
         AND b.status IN ('confirmed', 'pending')
         AND COALESCE(p.paid_at, b.created_at) >= NOW() - INTERVAL '7 days'
       GROUP BY day_number
       ORDER BY day_number`,
      [organizerId]
    ),
  ]);

  const statsRow = statsResult.rows[0] || {};
  const chartSeries = {
    sales: Array(7).fill(0),
    revenue: Array(7).fill(0),
    visitors: Array(7).fill(0),
  };

  chartResult.rows.forEach((row) => {
    const dayIndex = Number(row.day_number || 1) - 1;

    if (dayIndex >= 0 && dayIndex < 7) {
      chartSeries.sales[dayIndex] = Number(row.sales || 0);
      chartSeries.revenue[dayIndex] = formatCurrencyValue(row.revenue);
      chartSeries.visitors[dayIndex] = Number(row.visitors || 0);
    }
  });

  res.json({
    stats: {
      totalRevenue: formatCurrencyValue(statsRow.total_revenue),
      ticketsSold: Number(statsRow.tickets_sold || 0),
      totalEvents: Number(statsRow.total_events || 0),
      conversionRate: Number(statsRow.conversion_rate || 0),
    },
    chartSeries,
    recentActivity: activityResult.rows.map((row) => ({
      id: row.id,
      event: row.event_title,
      user: row.user_name,
      action: `Purchased ${Number(row.quantity || 1)} ticket(s)`,
      amount: formatCurrencyValue(row.amount),
      paidAt: row.paid_at,
      status: row.status,
    })),
  });
}

export async function getAdminDashboard(_req, res) {
  const [statsResult, approvalsResult] = await Promise.all([
    query(
      `SELECT
         COUNT(*) AS total_users,
         COUNT(*) FILTER (WHERE role = 'organizer') AS total_organizers,
         (SELECT COUNT(*) FROM events) AS total_events,
         (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE payment_status = 'success') AS revenue_summary
       FROM users`
    ),
    query(
      `SELECT
         oa.id,
         oa.organization_name,
         oa.contact_email,
         oa.status,
         oa.created_at
       FROM organizer_applications oa
       WHERE oa.status = 'pending'
       ORDER BY oa.created_at DESC
       LIMIT 5`
    ),
  ]);

  const statsRow = statsResult.rows[0] || {};

  res.json({
    stats: {
      totalUsers: Number(statsRow.total_users || 0),
      totalOrganizers: Number(statsRow.total_organizers || 0),
      totalEvents: Number(statsRow.total_events || 0),
      revenueSummary: formatCurrencyValue(statsRow.revenue_summary),
    },
    pendingApprovals: approvalsResult.rows.map((row) => ({
      id: row.id,
      name: row.organization_name,
      email: row.contact_email,
      status: row.status,
      submittedAt: row.created_at,
    })),
  });
}

export async function listUsers(req, res) {
  const { role = '', search = '' } = req.query;
  const values = [];
  const filters = [];

  if (role && role !== 'All') {
    values.push(toDbRole(role.toLowerCase()));
    filters.push(`u.role = $${values.length}`);
  }

  if (search) {
    values.push(`%${search.toLowerCase()}%`);
    filters.push(`(LOWER(u.full_name) LIKE $${values.length} OR LOWER(u.email) LIKE $${values.length})`);
  }

  const result = await query(
    `SELECT
       u.id,
       u.full_name,
       u.email,
       u.role,
       u.status,
       u.created_at,
       COUNT(b.id) FILTER (WHERE b.status = 'confirmed') AS bookings_count
     FROM users u
     LEFT JOIN bookings b ON b.user_id = u.id
     ${filters.length ? `WHERE ${filters.join(' AND ')}` : ''}
     GROUP BY u.id
     ORDER BY u.created_at DESC`,
    values
  );

  res.json({
    users: result.rows.map(mapUser),
  });
}

export async function createUser(req, res) {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(password, 10);
  const dbRole = toDbRole(role);
  const duplicate = await query('SELECT id FROM users WHERE email = $1 LIMIT 1', [normalizedEmail]);

  if (duplicate.rowCount > 0) {
    return res.status(409).json({ message: 'A user with this email already exists.' });
  }

  const result = await query(
    `INSERT INTO users (full_name, email, password_hash, role, status)
     VALUES ($1, $2, $3, $4, 'active')
     RETURNING id, full_name, email, role, status, created_at`,
    [name.trim(), normalizedEmail, passwordHash, dbRole]
  );

  await query(
    `INSERT INTO user_profiles (user_id)
     VALUES ($1)
     ON CONFLICT (user_id) DO NOTHING`,
    [result.rows[0].id]
  );

  res.status(201).json({
    message: 'User created successfully.',
    user: mapUser(result.rows[0]),
  });
}

export async function updateUserStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  const result = await query(
    `UPDATE users
     SET status = $2, updated_at = NOW()
     WHERE id = $1
     RETURNING id`,
    [id, status]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ message: 'User not found.' });
  }

  res.json({ message: 'User status updated successfully.' });
}

export async function deleteUser(req, res) {
  const { id } = req.params;
  const result = await query('DELETE FROM users WHERE id = $1', [id]);

  if (result.rowCount === 0) {
    return res.status(404).json({ message: 'User not found.' });
  }

  res.json({ message: 'User deleted successfully.' });
}

export async function listOrganizerApplications(req, res) {
  const { status = '', name = '', email = '' } = req.query;
  const values = [];
  const filters = [];

  if (status) {
    values.push(status.toLowerCase());
    filters.push(`oa.status = $${values.length}`);
  }

  if (name) {
    values.push(`%${name.toLowerCase()}%`);
    filters.push(`LOWER(oa.organization_name) LIKE $${values.length}`);
  }

  if (email) {
    values.push(`%${email.toLowerCase()}%`);
    filters.push(`LOWER(oa.contact_email) LIKE $${values.length}`);
  }

  const result = await query(
    `SELECT
       oa.id,
       oa.user_id,
       oa.organization_name,
       oa.contact_email,
       oa.status,
       oa.created_at
     FROM organizer_applications oa
     ${filters.length ? `WHERE ${filters.join(' AND ')}` : ''}
     ORDER BY oa.created_at DESC`,
    values
  );

  res.json({
    applications: result.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      name: row.organization_name,
      email: row.contact_email,
      status: row.status,
      submittedAt: row.created_at,
    })),
  });
}

export async function createOrganizerApplication(req, res) {
  const { name, email, status = 'pending' } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Organization name and email are required.' });
  }

  const existingUser = await query('SELECT id FROM users WHERE email = $1 LIMIT 1', [
    email.trim().toLowerCase(),
  ]);

  let userId = existingUser.rows[0]?.id;

  if (!userId) {
    const passwordHash = await bcrypt.hash('eventify123', 10);
    const userResult = await query(
      `INSERT INTO users (full_name, email, password_hash, role, status)
       VALUES ($1, $2, $3, 'organizer', 'active')
       RETURNING id`,
      [name.trim(), email.trim().toLowerCase(), passwordHash]
    );
    userId = userResult.rows[0].id;
  }

  const result = await query(
    `INSERT INTO organizer_applications (
       user_id,
       organization_name,
       business_type,
       contact_email,
       description,
       status
     )
     VALUES ($1, $2, 'Individual', $3, 'Created from admin panel.', $4)
     ON CONFLICT (user_id)
     DO UPDATE SET
       organization_name = EXCLUDED.organization_name,
       contact_email = EXCLUDED.contact_email,
       status = EXCLUDED.status,
       updated_at = NOW()
     RETURNING id, user_id, organization_name, contact_email, status, created_at`,
    [userId, name.trim(), email.trim().toLowerCase(), status.toLowerCase()]
  );

  res.status(201).json({
    message: 'Organizer application saved successfully.',
    application: {
      id: result.rows[0].id,
      userId: result.rows[0].user_id,
      name: result.rows[0].organization_name,
      email: result.rows[0].contact_email,
      status: result.rows[0].status,
      submittedAt: result.rows[0].created_at,
    },
  });
}

export async function updateOrganizerApplication(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  const result = await query(
    `UPDATE organizer_applications
     SET status = $2,
         reviewed_at = NOW(),
         updated_at = NOW()
     WHERE id = $1
     RETURNING user_id, status`,
    [id, status.toLowerCase()]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ message: 'Application not found.' });
  }

  if (result.rows[0].status === 'approved') {
    await query(
      `UPDATE users
       SET role = 'organizer', status = 'active', updated_at = NOW()
       WHERE id = $1`,
      [result.rows[0].user_id]
    );
  }

  res.json({ message: 'Organizer application updated successfully.' });
}

export async function listAdminNotifications(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'User id is required.' });
  }

  const result = await query(
    `SELECT id, title, message, type, is_read, created_at
     FROM notifications
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );

  res.json({
    notifications: result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      message: row.message,
      type: row.type || 'general',
      isRead: Boolean(row.is_read),
      createdAt: row.created_at,
    })),
  });
}

export async function markAdminNotificationAsRead(req, res) {
  const { id } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User id is required.' });
  }

  const result = await query(
    `UPDATE notifications
     SET is_read = TRUE
     WHERE id = $1
       AND user_id = $2
     RETURNING id`,
    [id, userId]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ message: 'Notification not found.' });
  }

  return res.json({ message: 'Notification marked as read.' });
}

export async function markAllAdminNotificationsAsRead(req, res) {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User id is required.' });
  }

  await query(
    `UPDATE notifications
     SET is_read = TRUE
     WHERE user_id = $1`,
    [userId]
  );

  return res.json({ message: 'All notifications marked as read.' });
}

export async function createNotification(req, res) {
  const { userId, title, message, type = 'general' } = req.body;

  if (!userId || !title || !message) {
    return res.status(400).json({ message: 'User id, title, and message are required.' });
  }

  const result = await query(
    `INSERT INTO notifications (user_id, title, message, type)
     VALUES ($1, $2, $3, $4)
     RETURNING id, title, message, type, is_read, created_at`,
    [userId, title, message, type]
  );

  res.status(201).json({
    notification: {
      id: result.rows[0].id,
      title: result.rows[0].title,
      message: result.rows[0].message,
      type: result.rows[0].type,
      isRead: Boolean(result.rows[0].is_read),
      createdAt: result.rows[0].created_at,
    },
  });
}

export async function uploadUserAvatar(req, res) {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User id is required.' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const avatarUrl = `/uploads/avatars/${req.file.filename}`;

  await query(
    `UPDATE users
     SET avatar_url = $1,
         updated_at = NOW()
     WHERE id = $2`,
    [avatarUrl, userId]
  );

  res.json({
    message: 'Avatar uploaded successfully.',
    avatarUrl: avatarUrl,
  });
}

export async function createBooking(req, res) {
  const { userId, eventId, ticketType, quantity, totalAmount } = req.body;

  if (!userId || !eventId || !ticketType || !quantity || !totalAmount) {
    return res.status(400).json({ message: 'All booking fields are required.' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Log the values being inserted
    console.log('Creating booking with:', { userId, eventId, ticketType, quantity, totalAmount });

    // Try to handle both UUID and integer IDs
    let eventIdFormatted = eventId;
    let userIdFormatted = userId;
    
    // If IDs don't look like UUIDs, try to cast as integer
    if (!eventId.includes('-')) {
      eventIdFormatted = parseInt(eventId, 10);
    }
    if (!userId.includes('-')) {
      userIdFormatted = parseInt(userId, 10);
    }
    
    console.log('Formatted IDs:', { eventIdFormatted, userIdFormatted });

    // Create booking - let PostgreSQL handle the casting
    const bookingResult = await client.query(
      `INSERT INTO bookings (event_id, user_id, status, total_amount, created_at, updated_at)
       VALUES ($1, $2, 'pending', $3, NOW(), NOW())
       RETURNING id, event_id, user_id, status, total_amount, created_at`,
      [eventIdFormatted, userIdFormatted, totalAmount]
    );

    const booking = bookingResult.rows[0];
    console.log('Booking created:', booking);

    // Get ticket type ID - handle both integer and UUID event IDs
    let ticketTypeResult;
    if (typeof eventIdFormatted === 'number' || !eventId.includes('-')) {
      // Try with integer event_id
      ticketTypeResult = await client.query(
        `SELECT id, price FROM ticket_types 
         WHERE event_id = $1 
         AND (name ILIKE $2 OR name ILIKE $3 OR name ILIKE $4) 
         LIMIT 1`,
        [eventIdFormatted, ticketType, `%${ticketType}%`, ticketType.replace(/([A-Z])/g, ' $1').trim()]
      );
    } else {
      // Try with UUID event_id
      ticketTypeResult = await client.query(
        `SELECT id, price FROM ticket_types 
         WHERE event_id = $1::uuid 
         AND (name ILIKE $2 OR name ILIKE $3 OR name ILIKE $4) 
         LIMIT 1`,
        [eventId, ticketType, `%${ticketType}%`, ticketType.replace(/([A-Z])/g, ' $1').trim()]
      );
    }

    let ticketTypeId = null;
    let unitPrice = totalAmount / quantity;

    if (ticketTypeResult.rowCount > 0) {
      ticketTypeId = ticketTypeResult.rows[0].id;
      unitPrice = ticketTypeResult.rows[0].price;
      console.log('Found ticket type:', ticketTypeId, 'price:', unitPrice);
    } else {
      console.log('No ticket type found for event:', eventId, 'ticket:', ticketType);
    }

    // Create booking item
    await client.query(
      `INSERT INTO booking_items (booking_id, ticket_type_id, quantity, unit_price, total_price)
       VALUES ($1, $2, $3, $4, $5)`,
      [booking.id, ticketTypeId, quantity, unitPrice, totalAmount]
    );

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Booking created successfully.',
      booking: {
        id: booking.id,
        eventId: booking.event_id,
        userId: booking.user_id,
        status: booking.status,
        totalAmount: booking.total_amount,
        createdAt: booking.created_at,
        ticketType,
        quantity,
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create booking error:', error);
    console.error('Error details:', error.message, error.code);
    res.status(500).json({ message: `Failed to create booking: ${error.message}` });
  } finally {
    client.release();
  }
}

export async function getEventById(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Event ID is required.' });
  }

  try {
    const result = await query(
      `SELECT 
        e.id, e.title, e.description, e.start_at, e.end_at,
        e.base_price, e.banner_url, e.status,
        c.name AS category_name,
        v.name AS venue_name, v.city AS venue_city,
        o.full_name AS organizer_name
      FROM events e
      LEFT JOIN categories c ON c.id = e.category_id
      LEFT JOIN venues v ON v.id = e.venue_id
      LEFT JOIN users o ON o.id = e.organizer_id
      WHERE e.id = $1
      LIMIT 1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    const event = result.rows[0];
    res.json({
      event: {
        id: event.id,
        title: event.title,
        description: event.description,
        startAt: event.start_at,
        endAt: event.end_at,
        basePrice: event.base_price,
        bannerUrl: event.banner_url,
        status: event.status,
        categoryName: event.category_name,
        venueName: event.venue_name,
        venueCity: event.venue_city,
        organizerName: event.organizer_name,
      },
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Failed to fetch event.' });
  }
}

export async function processPayment(req, res) {
  const { bookingId, userId, amount, paymentMethod } = req.body;

  if (!bookingId || !userId || amount === undefined || amount === null) {
    return res.status(400).json({ message: 'Booking ID, user ID, and amount are required.' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    console.log('Processing payment:', { bookingId, userId, amount, paymentMethod });

    // Create payment record with UUID casting
    const paymentResult = await client.query(
      `INSERT INTO payments (booking_id, provider, amount, payment_status, paid_at, created_at)
       VALUES ($1::uuid, $2, $3, 'success', NOW(), NOW())
       RETURNING id, booking_id, amount, payment_status, paid_at`,
      [bookingId, paymentMethod || 'manual', amount]
    );

    console.log('Payment record created:', paymentResult.rows[0]);

    // Update booking status to confirmed
    await client.query(
      `UPDATE bookings 
       SET status = 'confirmed', updated_at = NOW()
       WHERE id = $1::uuid`,
      [bookingId]
    );

    console.log('Booking status updated to confirmed');

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Payment processed successfully.',
      payment: {
        id: paymentResult.rows[0].id,
        bookingId: paymentResult.rows[0].booking_id,
        amount: paymentResult.rows[0].amount,
        status: paymentResult.rows[0].payment_status,
        paidAt: paymentResult.rows[0].paid_at,
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Process payment error:', error);
    console.error('Error details:', error.message, error.code);
    res.status(500).json({ message: `Failed to process payment: ${error.message}` });
  } finally {
    client.release();
  }
}
