import { query } from './backend/src/config/db.js';

async function checkDatabase() {
  try {
    console.log('=== DATABASE DIAGNOSTICS ===\n');

    // Check users
    console.log('1. USERS:');
    const users = await query('SELECT id, full_name, email FROM users LIMIT 2');
    console.log(users.rows);
    console.log('User ID type:', typeof users.rows[0]?.id);
    console.log('');

    // Check events
    console.log('2. EVENTS:');
    const events = await query('SELECT id, title FROM events LIMIT 2');
    console.log(events.rows);
    console.log('');

    // Check ticket types
    console.log('3. TICKET TYPES:');
    const tickets = await query('SELECT id, name, price, event_id FROM ticket_types LIMIT 3');
    console.log(tickets.rows);
    console.log('');

    // Check if sample event exists
    console.log('4. Looking for event with ID 1 or similar:');
    const sampleEvent = await query(`SELECT * FROM events WHERE id = '1' OR title ILIKE '%tech%' LIMIT 1`);
    console.log(sampleEvent.rows);
    console.log('');

  } catch (err) {
    console.error('ERROR:', err.message);
    console.error(err);
  } finally {
    process.exit(0);
  }
}

checkDatabase();
