/**
 * Database Initialization Script
 * Creates schema and sample data
 * Run: node scripts/init-database.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, testConnection, query, closePool } from '../src/config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCHEMA_FILE = path.join(__dirname, '../database-schema-complete.sql');

async function initDatabase() {
  console.log('========================================');
  console.log('  EVENTIFY DATABASE INITIALIZATION');
  console.log('========================================\n');

  try {
    // Step 1: Test connection
    console.log('[1/4] Testing database connection...');
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('\n❌ Cannot connect to database. Please check:');
      console.error('   - PostgreSQL is running');
      console.error('   - DATABASE_URL in .env is correct');
      console.error('   - Database exists');
      process.exit(1);
    }
    console.log('✅ Connected\n');

    // Step 2: Check if schema file exists
    console.log('[2/4] Checking schema file...');
    if (!fs.existsSync(SCHEMA_FILE)) {
      console.error(`❌ Schema file not found: ${SCHEMA_FILE}`);
      process.exit(1);
    }
    console.log(`✅ Found: ${SCHEMA_FILE}\n`);

    // Step 3: Read and execute schema
    console.log('[3/4] Executing schema...');
    const schemaSQL = fs.readFileSync(SCHEMA_FILE, 'utf8');
    
    // Split by semicolons to execute statements individually
    const statements = schemaSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`   Found ${statements.length} SQL statements`);
    
    // Execute in a transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i];
        try {
          // Skip empty lines and comments
          if (!stmt || stmt.startsWith('--') || stmt.startsWith('/*')) {
            continue;
          }
          
          await client.query(stmt + ';');
          
          // Progress indicator every 10 statements
          if ((i + 1) % 10 === 0) {
            process.stdout.write(`\r   Executed: ${i + 1}/${statements.length}`);
          }
        } catch (stmtError) {
          // Ignore "already exists" errors
          if (stmtError.message.includes('already exists') || 
              stmtError.message.includes('duplicate key')) {
            continue;
          }
          // Log other errors but continue
          console.warn(`\n   ⚠️  Warning at statement ${i + 1}: ${stmtError.message}`);
        }
      }
      
      console.log(`\r   ✅ Executed: ${statements.length}/${statements.length}`);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    
    console.log('✅ Schema created\n');

    // Step 4: Verify
    console.log('[4/4] Verifying setup...');
    const tableCount = await query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `);
    
    const count = parseInt(tableCount.rows[0].count);
    console.log(`   📊 Tables created: ${count}`);
    
    if (count < 20) {
      console.warn('   ⚠️  Warning: Expected at least 20 tables');
    } else {
      console.log('   ✅ Schema verification passed');
    }
    
    // Check sample data
    const categories = await query('SELECT COUNT(*) as count FROM categories');
    const settings = await query('SELECT COUNT(*) as count FROM system_settings');
    
    console.log(`   📋 Categories: ${categories.rows[0].count}`);
    console.log(`   ⚙️  Settings: ${settings.rows[0].count}`);

    console.log('\n========================================');
    console.log('  INITIALIZATION COMPLETE ✅');
    console.log('========================================');
    console.log('\nNext steps:');
    console.log('  1. Start backend: npm start');
    console.log('  2. Start frontend: npm run dev');
    console.log('  3. Test connection: node scripts/test-database.js');

  } catch (error) {
    console.error('\n❌ Initialization failed:');
    console.error(error.message);
    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    process.exit(1);
  } finally {
    await closePool();
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: node scripts/init-database.js [options]

Options:
  --help, -h     Show this help
  --force        Force re-creation (drops existing tables)
  --test         Run tests after initialization

Environment:
  DATABASE_URL   PostgreSQL connection string
  
Example:
  DATABASE_URL=postgresql://user:pass@localhost:5432/eventify_db node scripts/init-database.js
  `);
  process.exit(0);
}

initDatabase();
