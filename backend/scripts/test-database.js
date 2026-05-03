/**
 * Database Connection Test Script
 * Run: node scripts/test-database.js
 */

import { 
  testConnection, 
  getStats, 
  verifySchema, 
  query,
  closePool 
} from '../src/config/database.js';

async function runTests() {
  console.log('========================================');
  console.log('  EVENTIFY DATABASE CONNECTION TEST');
  console.log('========================================\n');

  try {
    // Test 1: Basic Connection
    console.log('[1/5] Testing basic connection...');
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('❌ Connection failed!');
      process.exit(1);
    }
    console.log('✅ Connection successful\n');

    // Test 2: Query Execution
    console.log('[2/5] Testing query execution...');
    const result = await query('SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = $1', ['public']);
    const tableCount = result.rows[0].count;
    console.log(`✅ Query successful - Found ${tableCount} tables\n`);

    // Test 3: Database Statistics
    console.log('[3/5] Fetching database statistics...');
    const stats = await getStats();
    console.log('Database Stats:');
    console.log(`  📊 Tables: ${stats.tables}`);
    console.log(`  🔌 Active Connections: ${stats.connections}`);
    console.log(`  💾 Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  🏊 Pool Total: ${stats.pool.total}`);
    console.log(`  🏊 Pool Idle: ${stats.pool.idle}`);
    console.log(`  🏊 Pool Waiting: ${stats.pool.waiting}`);
    console.log('✅ Stats retrieved\n');

    // Test 4: Schema Verification
    console.log('[4/5] Verifying database schema...');
    const schema = await verifySchema();
    console.log(`Schema Check:`);
    console.log(`  📋 Required Tables: ${schema.total}`);
    console.log(`  ✅ Existing Tables: ${schema.existing}`);
    
    if (schema.isComplete) {
      console.log('✅ Schema is complete!\n');
    } else {
      console.warn(`⚠️  Missing Tables: ${schema.missing.length}`);
      schema.missing.forEach(table => console.warn(`     - ${table}`));
      console.log('');
    }

    // Test 5: Sample Data Check
    console.log('[5/5] Checking sample data...');
    const categories = await query('SELECT name FROM categories LIMIT 5');
    if (categories.rows.length > 0) {
      console.log('✅ Sample data exists:');
      categories.rows.forEach(cat => console.log(`     - ${cat.name}`));
    } else {
      console.log('⚠️  No categories found - run sample data SQL');
    }

    console.log('\n========================================');
    console.log('  ALL TESTS PASSED ✅');
    console.log('========================================');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await closePool();
  }
}

runTests();
