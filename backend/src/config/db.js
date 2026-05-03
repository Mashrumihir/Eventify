/**
 * Database Configuration (Legacy Export)
 * Re-exports from database.js for backward compatibility
 * New code should import from database.js directly
 */

export { 
  pool, 
  query,
  queryOne,
  queryValue,
  transaction,
  testConnection,
  closePool 
} from './database.js';

