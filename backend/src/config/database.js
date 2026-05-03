/**
 * Eventify Database Configuration
 * PostgreSQL Connection with Pool Management
 * Supports SSL, Connection Retry, and Query Logging
 */

import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

// ============================================================================
// DATABASE CONFIGURATION
// ============================================================================

const dbConfig = {
  // Connection string from environment
  connectionString: env.databaseUrl || 'postgresql://postgres:Mihir1234@localhost:5432/eventify_db',
  
  // Pool settings for performance
  max: 20,                          // Maximum pool size
  min: 5,                           // Minimum pool size
  idleTimeoutMillis: 30000,         // Close idle clients after 30s
  connectionTimeoutMillis: 5000,    // Timeout for new connections
  
  // SSL configuration for production
  ssl: env.nodeEnv === 'production' ? {
    rejectUnauthorized: false       // Required for some cloud providers
  } : false,
  
  // Application name for monitoring
  application_name: 'eventify_api',
};

// ============================================================================
// CREATE CONNECTION POOL
// ============================================================================

export const pool = new Pool(dbConfig);

// ============================================================================
// POOL EVENT HANDLERS (Monitoring & Error Handling)
// ============================================================================

// Log new connections
pool.on('connect', (client) => {
  console.log(`[DB] New client connected (Total: ${pool.totalCount}, Idle: ${pool.idleCount}, Waiting: ${pool.waitingCount})`);
});

// Handle client errors
pool.on('error', (err, client) => {
  console.error('[DB] Unexpected error on idle client:', err.message);
  // Don't exit - let the pool recover
});

// Log when client is removed from pool
pool.on('remove', () => {
  console.log(`[DB] Client removed from pool (Total: ${pool.totalCount})`);
});

// ============================================================================
// CORE QUERY FUNCTIONS
// ============================================================================

/**
 * Execute a single query
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Promise<QueryResult>}
 */
export async function query(text, params = []) {
  const start = Date.now();
  
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    // Log slow queries (> 1000ms)
    if (duration > 1000) {
      console.warn(`[DB] Slow query (${duration}ms): ${text.substring(0, 100)}...`);
    }
    
    return result;
  } catch (error) {
    console.error('[DB] Query error:', {
      message: error.message,
      query: text.substring(0, 200),
      params: params,
    });
    throw error;
  }
}

/**
 * Get a single row from query
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Promise<Object|null>}
 */
export async function queryOne(text, params = []) {
  const result = await query(text, params);
  return result.rows[0] || null;
}

/**
 * Execute query and return first column of first row
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Promise<any>}
 */
export async function queryValue(text, params = []) {
  const result = await query(text, params);
  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  return row[Object.keys(row)[0]];
}

// ============================================================================
// TRANSACTION SUPPORT
// ============================================================================

/**
 * Execute queries within a transaction
 * @param {Function} callback - Async function receiving client
 * @returns {Promise<any>}
 */
export async function transaction(callback) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Begin a transaction manually
 * @returns {Promise<Client>}
 */
export async function beginTransaction() {
  const client = await pool.connect();
  await client.query('BEGIN');
  return client;
}

/**
 * Commit a transaction
 * @param {Client} client - Database client
 */
export async function commitTransaction(client) {
  try {
    await client.query('COMMIT');
  } finally {
    client.release();
  }
}

/**
 * Rollback a transaction
 * @param {Client} client - Database client
 */
export async function rollbackTransaction(client) {
  try {
    await client.query('ROLLBACK');
  } finally {
    client.release();
  }
}

// ============================================================================
// DATABASE HEALTH CHECKS
// ============================================================================

/**
 * Test database connection
 * @returns {Promise<boolean>}
 */
export async function testConnection() {
  try {
    const result = await query('SELECT NOW() as current_time, version() as version');
    console.log('[DB] Connection successful');
    console.log(`[DB] Server time: ${result.rows[0].current_time}`);
    console.log(`[DB] PostgreSQL version: ${result.rows[0].version.split(' ')[0]}`);
    return true;
  } catch (error) {
    console.error('[DB] Connection failed:', error.message);
    return false;
  }
}

/**
 * Get database statistics
 * @returns {Promise<Object>}
 */
export async function getStats() {
  const stats = await query(`
    SELECT 
      (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public') as table_count,
      (SELECT COUNT(*) FROM pg_stat_activity WHERE datname = current_database()) as active_connections,
      (SELECT pg_database_size(current_database())) as database_size_bytes
  `);
  
  return {
    tables: parseInt(stats.rows[0].table_count),
    connections: parseInt(stats.rows[0].active_connections),
    size: parseInt(stats.rows[0].database_size_bytes),
    pool: {
      total: pool.totalCount,
      idle: pool.idleCount,
      waiting: pool.waitingCount,
    }
  };
}

// ============================================================================
// SCHEMA VERIFICATION
// ============================================================================

/**
 * Check if all required tables exist
 * @returns {Promise<Object>}
 */
export async function verifySchema() {
  const requiredTables = [
    'users', 'user_profiles', 'user_sessions',
    'organizer_applications', 'organizer_profiles',
    'categories', 'venues', 'events',
    'ticket_types', 'ticket_inventory', 'promo_codes',
    'bookings', 'booking_items', 'payments', 'refunds', 'cart_items',
    'reviews', 'wishlists', 'event_views',
    'notifications', 'email_templates',
    'contact_messages', 'newsletter_subscribers',
    'system_settings', 'activity_logs',
    'payouts', 'payout_items'
  ];
  
  const result = await query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
  `);
  
  const existingTables = result.rows.map(r => r.table_name);
  const missingTables = requiredTables.filter(t => !existingTables.includes(t));
  
  return {
    total: requiredTables.length,
    existing: existingTables.length,
    missing: missingTables,
    isComplete: missingTables.length === 0,
    tables: existingTables
  };
}

// ============================================================================
// CONNECTION MANAGEMENT
// ============================================================================

/**
 * Gracefully close all connections
 * @returns {Promise<void>}
 */
export async function closePool() {
  console.log('[DB] Closing connection pool...');
  await pool.end();
  console.log('[DB] Pool closed');
}

/**
 * Reset connection pool (useful for tests)
 * @returns {Promise<void>}
 */
export async function resetPool() {
  await closePool();
  // Pool will auto-reconnect on next query
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format UUID for PostgreSQL
 * @param {string} uuid - UUID string
 * @returns {string} - Formatted UUID
 */
export function formatUUID(uuid) {
  if (!uuid) return null;
  // Remove any whitespace and validate format
  const clean = uuid.toString().trim().toLowerCase();
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
  return uuidRegex.test(clean) ? clean : null;
}

/**
 * Build WHERE clause for filtering
 * @param {Object} filters - Filter conditions
 * @param {number} paramIndex - Starting parameter index
 * @returns {Object} - { clause: string, params: Array, nextIndex: number }
 */
export function buildWhereClause(filters, paramIndex = 1) {
  const conditions = [];
  const params = [];
  let index = paramIndex;
  
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '') {
      conditions.push(`${key} = $${index}`);
      params.push(value);
      index++;
    }
  }
  
  return {
    clause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
    params,
    nextIndex: index
  };
}

/**
 * Build pagination clause
 * @param {Object} pagination - { page, limit }
 * @param {number} paramIndex - Starting parameter index
 * @returns {Object} - { clause: string, params: Array }
 */
export function buildPagination(pagination = {}, paramIndex = 1) {
  const page = Math.max(1, parseInt(pagination.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(pagination.limit) || 20));
  const offset = (page - 1) * limit;
  
  return {
    clause: `LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    params: [limit, offset],
    page,
    limit,
    offset
  };
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Test connection on startup (non-blocking)
setTimeout(async () => {
  const isConnected = await testConnection();
  if (!isConnected) {
    console.error('[DB] WARNING: Database not connected. API may not function correctly.');
  }
}, 1000);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n[DB] SIGINT received, closing pool...');
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n[DB] SIGTERM received, closing pool...');
  await closePool();
  process.exit(0);
});

export default {
  pool,
  query,
  queryOne,
  queryValue,
  transaction,
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
  testConnection,
  getStats,
  verifySchema,
  closePool,
  resetPool,
  formatUUID,
  buildWhereClause,
  buildPagination,
};
