import bcrypt from 'bcryptjs';
import { query } from '../config/db.js';
import { dbRoleToFrontendRole, frontendRoleToDbRole } from '../utils/mapRole.js';

function sanitizeUser(row) {
  return {
    id: row.id,
    name: row.full_name,
    email: row.email,
    role: dbRoleToFrontendRole(row.role),
    dbRole: row.role,
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function register(req, res) {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const selectedRole = frontendRoleToDbRole(role);

  const existingUser = await query(
    'SELECT id FROM users WHERE email = $1 LIMIT 1',
    [normalizedEmail]
  );

  if (existingUser.rowCount > 0) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const userStatus = selectedRole === 'admin' ? 'pending' : 'active';

  const userResult = await query(
    `INSERT INTO users (full_name, email, password_hash, role, status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, full_name, email, role, status, created_at`,
    [name.trim(), normalizedEmail, passwordHash, selectedRole, userStatus]
  );

  const user = userResult.rows[0];

  await query(
    `INSERT INTO user_profiles (
      user_id,
      is_email_notifications_enabled,
      is_push_notifications_enabled,
      is_event_reminders_enabled,
      is_promotional_notifications_enabled
    ) VALUES ($1, TRUE, TRUE, TRUE, FALSE)`,
    [user.id]
  );

  if (selectedRole === 'organizer') {
    await query(
      `INSERT INTO organizer_applications (
        user_id,
        organization_name,
        business_type,
        contact_email,
        description,
        status
      ) VALUES ($1, $2, $3, $4, $5, 'pending')`,
      [
        user.id,
        `${name.trim()} Events`,
        'Individual',
        normalizedEmail,
        'Auto-created organizer application from registration.',
      ]
    );
  }

  return res.status(201).json({
    message:
      selectedRole === 'organizer'
        ? 'Registration successful. Organizer account created and pending approval.'
        : 'Registration successful.',
    user: sanitizeUser(user),
  });
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const result = await query(
    `SELECT id, full_name, email, password_hash, role, status, created_at
     FROM users
     WHERE email = $1
     LIMIT 1`,
    [normalizedEmail]
  );

  if (result.rowCount === 0) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const user = result.rows[0];
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  if (user.status === 'blocked' || user.status === 'suspended') {
    return res.status(403).json({ message: `This account is ${user.status}.` });
  }

  if (user.role === 'admin' && user.status === 'pending') {
    return res.status(403).json({ message: 'Admin account is pending approval.' });
  }

  await query(
    'UPDATE users SET last_login_at = NOW(), updated_at = NOW() WHERE id = $1',
    [user.id]
  );

  return res.json({
    message: 'Login successful.',
    user: sanitizeUser(user),
  });
}
