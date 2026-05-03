import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function syncDb() {
  const syncPath = path.resolve(__dirname, '../db/sync.sql');
  const syncSql = await fs.readFile(syncPath, 'utf8');

  await pool.query(syncSql);
  await pool.end();

  console.log('Eventify database schema synced successfully.');
}

syncDb().catch(async (error) => {
  console.error('Database sync failed:', error.message);
  await pool.end();
  process.exit(1);
});
