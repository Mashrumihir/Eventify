import bcrypt from 'bcryptjs';
import { query } from '../config/db.js';
import { toDbRole, toFrontendRole } from '../utils/roles.js';

function formatUser(user) {
  const baseUrl = process.env.CLIENT_URL?.replace('/api', '') || 'http://localhost:5000';
  return {
    id: user.id,
    name: user.full_name,
    email: user.email,
    role: toFrontendRole(user.role),
    dbRole: user.role,
    status: user.status,
    createdAt: user.created_at,
    avatarUrl: user.avatar_url ? `${baseUrl}${user.avatar_url}` : null,
  };
}

export async function register(req, res) {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const dbRole = toDbRole(role);

  const duplicate = await query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);

  if (duplicate.rowCount > 0) {
    return res.status(409).json({ message: 'Email already registered.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const result = await query(
    `INSERT INTO users (full_name, email, password_hash, role, status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, full_name, email, role, status, created_at`,
    [name.trim(), normalizedEmail, passwordHash, dbRole, dbRole === 'admin' ? 'pending' : 'active']
  );

  const user = result.rows[0];

  await query(
    `INSERT INTO user_profiles (user_id)
     VALUES ($1)
     ON CONFLICT (user_id) DO NOTHING`,
    [user.id]
  );

  if (dbRole === 'organizer') {
    await query(
      `INSERT INTO organizer_applications (
        user_id,
        organization_name,
        business_type,
        contact_email,
        description,
        status
      )
      VALUES ($1, $2, $3, $4, $5, 'pending')
      ON CONFLICT (user_id) DO NOTHING`,
      [
        user.id,
        `${name.trim()} Events`,
        'Individual',
        normalizedEmail,
        'Created automatically during organizer registration.',
      ]
    );
  }

  return res.status(201).json({
    message: 'Registration successful.',
    user: formatUser(user),
  });
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const result = await query(
    `SELECT id, full_name, email, password_hash, role, status, created_at, avatar_url
     FROM users
     WHERE email = $1
     LIMIT 1`,
    [normalizedEmail]
  );

  if (result.rowCount === 0) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const user = result.rows[0];
  const isValidPassword = await bcrypt.compare(password, user.password_hash);

  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  if (user.status === 'blocked' || user.status === 'suspended') {
    return res.status(403).json({ message: `This account is ${user.status}.` });
  }

  await query('UPDATE users SET last_login_at = NOW(), updated_at = NOW() WHERE id = $1', [
    user.id,
  ]);

  return res.json({
    message: 'Login successful.',
    user: formatUser(user),
  });
}
