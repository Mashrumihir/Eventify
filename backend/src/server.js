import app from './app.js';
import { env } from './config/env.js';
import { pool } from './config/db.js';

async function startServer() {
  try {
    await pool.query('SELECT 1');
    app.listen(env.port, () => {
      console.log(`Eventify backend running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start backend:', error.message);
    process.exit(1);
  }
}

startServer();
