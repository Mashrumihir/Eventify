/* global process */
import app from './app.js';
import { pool } from './config/db.js';
import { env } from './config/env.js';

async function startServer() {
  try {
    await pool.query('SELECT 1');

    app.listen(env.port, () => {
      console.log(`Eventify backend running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('Backend failed to start:', error.message);
    console.error('Check PostgreSQL is running and DATABASE_URL is correct in backend/.env');
    process.exit(1);
  }
}

startServer();
