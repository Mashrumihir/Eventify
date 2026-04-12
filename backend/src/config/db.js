import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

if (!env.databaseUrl) {
  // Keeping the failure explicit makes setup issues easier to understand.
  throw new Error('DATABASE_URL is not configured. Add it to backend/.env');
}

export const pool = new Pool({
  connectionString: env.databaseUrl,
});

export async function query(text, params = []) {
  return pool.query(text, params);
}
