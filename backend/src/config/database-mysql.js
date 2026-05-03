/**
 * Eventify MySQL Database Configuration
 * Alternative to PostgreSQL - MySQL 8.0+ Support
 */

import mysql from 'mysql2/promise';
import { env } from './env.js';

// ============================================================================
// CONNECTION CONFIGURATION
// ============================================================================

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  database: process.env.DB_NAME || 'eventify',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  
  // Pool settings
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  
  // Enable prepared statements
  namedPlaceholders: true,
  
  // Timezone
  timezone: '+00:00', // UTC
  
  // SSL (production)
  ssl: env.nodeEnv === 'production' ? {
    rejectUnauthorized: false
  } : undefined,
};

// Create pool
const pool = mysql.createPool(dbConfig);

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

/**
 * Execute a query
 * @param {string} sql - SQL query
 * @param {Array|Object} params - Query parameters
 * @returns {Promise<Array>}
 */
export async function query(sql, params = []) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('[MySQL] Query error:', error.message);
    console.error('[MySQL] SQL:', sql.substring(0, 200));
    throw error;
  }
}

/**
 * Get single row
 */
export async function queryOne(sql, params = []) {
  const rows = await query(sql, params);
  return rows[0] || null;
}

/**
 * Get single value
 */
export async function queryValue(sql, params = []) {
  const row = await queryOne(sql, params);
  if (!row) return null;
  const keys = Object.keys(row);
  return row[keys[0]];
}

/**
 * Insert and return ID
 */
export async function insert(sql, params = []) {
  try {
    const [result] = await pool.execute(sql, params);
    return result.insertId;
  } catch (error) {
    console.error('[MySQL] Insert error:', error.message);
    throw error;
  }
}

/**
 * Update and return affected rows
 */
export async function update(sql, params = []) {
  try {
    const [result] = await pool.execute(sql, params);
    return result.affectedRows;
  } catch (error) {
    console.error('[MySQL] Update error:', error.message);
    throw error;
  }
}

// ============================================================================
// TRANSACTIONS
// ============================================================================

/**
 * Execute in transaction
 */
export async function transaction(callback) {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Test connection
 */
export async function testConnection() {
  try {
    const result = await query('SELECT NOW() as current_time, VERSION() as version');
    console.log('[MySQL] Connection successful');
    console.log(`[MySQL] Server time: ${result[0].current_time}`);
    console.log(`[MySQL] Version: ${result[0].version}`);
    return true;
  } catch (error) {
    console.error('[MySQL] Connection failed:', error.message);
    return false;
  }
}

/**
 * Generate UUID (MySQL 8.0+)
 */
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Build WHERE clause
 */
export function buildWhere(filters, startIndex = 0) {
  const conditions = [];
  const values = [];
  let index = startIndex;
  
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '') {
      conditions.push(`${key} = ?`);
      values.push(value);
      index++;
    }
  }
  
  return {
    clause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
    values,
    nextIndex: index
  };
}

/**
 * Build pagination
 */
export function buildPagination(page = 1, limit = 20) {
  const offset = (Math.max(1, page) - 1) * Math.min(100, limit);
  return {
    clause: `LIMIT ${limit} OFFSET ${offset}`,
    limit,
    offset
  };
}

// ============================================================================
// ENUM HELPERS (MySQL uses reference tables instead of ENUM types)
// ============================================================================

export const Enums = {
  async getUserRoleId(roleName) {
    const result = await queryOne('SELECT id FROM enum_user_role WHERE role_name = ?', [roleName]);
    return result?.id;
  },
  
  async getAccountStatusId(statusName) {
    const result = await queryOne('SELECT id FROM enum_account_status WHERE status_name = ?', [statusName]);
    return result?.id;
  },
  
  async getEventStatusId(statusName) {
    const result = await queryOne('SELECT id FROM enum_event_status WHERE status_name = ?', [statusName]);
    return result?.id;
  },
  
  async getBookingStatusId(statusName) {
    const result = await queryOne('SELECT id FROM enum_booking_status WHERE status_name = ?', [statusName]);
    return result?.id;
  }
};

// ============================================================================
// INITIALIZATION
// ============================================================================

setTimeout(async () => {
  const isConnected = await testConnection();
  if (!isConnected) {
    console.warn('[MySQL] WARNING: Database not connected.');
  }
}, 1000);

process.on('SIGINT', async () => {
  console.log('\n[MySQL] Closing pool...');
  await pool.end();
  process.exit(0);
});

export default {
  pool,
  query,
  queryOne,
  queryValue,
  insert,
  update,
  transaction,
  testConnection,
  generateUUID,
  buildWhere,
  buildPagination,
  Enums
};
