import bcrypt from 'bcryptjs';
import { query } from '../config/db.js';
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

  const categoryResult = await query(
    `INSERT INTO categories (name)
     VALUES ($1)
     ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
     RETURNING id, name`,
    [category || 'General']
  );

  const venueResult = await query(
    `INSERT INTO venues (organizer_id, name, address, city, state)
     VALUES ($1, $2, $2, NULL, NULL)
     RETURNING id`,
    [organizerId, venue || 'Online']
  );

  const startAt = new Date(`${date}T${time || '00:00'}:00`);

  const eventResult = await query(
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
      categoryResult.rows[0].id,
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

  await query(
    `INSERT INTO ticket_types (event_id, name, price, quantity, is_early_bird)
     VALUES ($1, $2, $3, $4, FALSE)`,
    [eventResult.rows[0].id, 'General Admission', Number(ticketPrice) || 0, Number(quantity) || 0]
  );

  const createdEvent = await query(
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

  res.status(201).json({
    message: 'Event saved successfully.',
    event: mapEvent(createdEvent.rows[0]),
  });
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

  const categoryResult = await query(
    `INSERT INTO categories (name)
     VALUES ($1)
     ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    [category || 'General']
  );

  const venueResult = await query(
    `INSERT INTO venues (organizer_id, name, address, city, state)
     VALUES ($1, $2, $2, NULL, NULL)
     RETURNING id`,
    [current.rows[0].organizer_id, venue || 'Online']
  );

  const startAt = new Date(`${date}T${time || '00:00'}:00`);

  await query(
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
      categoryResult.rows[0].id,
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

  await query(
    `UPDATE ticket_types
     SET price = $2, quantity = $3
     WHERE event_id = $1`,
    [id, Number(ticketPrice) || 0, Number(quantity) || 0]
  );

  res.json({ message: 'Event updated successfully.' });
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

export async function getOrganizerDashboard(req, res) {
  const { organizerId } = req.query;

  if (!organizerId) {
    return res.status(400).json({ message: 'Organizer id is required.' });
  }

  const [statsResult, activityResult] = await Promise.all([
    query(
      `SELECT
         COUNT(*) AS total_events,
         COALESCE(SUM(e.tickets_sold), 0) AS tickets_sold,
         COALESCE(SUM(e.tickets_sold * e.base_price), 0) AS total_revenue,
         CASE
           WHEN COALESCE(SUM(e.capacity), 0) = 0 THEN 0
           ELSE ROUND((COALESCE(SUM(e.tickets_sold), 0)::NUMERIC / NULLIF(SUM(e.capacity), 0)) * 100, 1)
         END AS conversion_rate
       FROM events e
       WHERE e.organizer_id = $1`,
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
  ]);

  const statsRow = statsResult.rows[0] || {};

  res.json({
    stats: {
      totalRevenue: formatCurrencyValue(statsRow.total_revenue),
      ticketsSold: Number(statsRow.tickets_sold || 0),
      totalEvents: Number(statsRow.total_events || 0),
      conversionRate: Number(statsRow.conversion_rate || 0),
    },
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
