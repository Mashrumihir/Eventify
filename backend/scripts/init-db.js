import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDb() {
  const schemaPath = path.resolve(__dirname, '../../docs/postgres-schema.sql');
  const schemaSql = await fs.readFile(schemaPath, 'utf8');

  await pool.query(schemaSql);
  console.log('Database schema initialized successfully.');
  await pool.end();
}

initDb().catch(async (error) => {
  console.error('Failed to initialize database:', error.message);
  await pool.end();
  process.exit(1);
});
