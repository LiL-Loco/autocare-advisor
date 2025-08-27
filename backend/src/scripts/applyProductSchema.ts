/**
 * Apply Product Management Schema to Local PostgreSQL
 * AutoCare Advisor - Product Management Setup
 */

import fs from 'fs';
import path from 'path';
import billingPool from '../database/postgres';
import logger from '../utils/logger';

async function applyProductSchema(): Promise<void> {
  try {
    logger.info('🚀 Starting Product Management Schema Application...');

    // Read the schema file
    const schemaPath = path.join(__dirname, '../database/product_schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

    logger.info('📖 Schema file loaded successfully');

    // Get a client from the pool
    const client = await billingPool.connect();

    try {
      // Begin transaction
      await client.query('BEGIN');

      logger.info('🔧 Applying product management schema...');

      // Execute the schema SQL
      await client.query(schemaSQL);

      // Commit transaction
      await client.query('COMMIT');

      logger.info('✅ Product Management Schema applied successfully!');

      // Verify tables were created
      const result = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name LIKE 'product_%' OR table_name LIKE 'csv_%'
        ORDER BY table_name;
      `);

      logger.info('📊 Created tables:');
      result.rows.forEach((row) => {
        logger.info(`   - ${row.table_name}`);
      });
    } catch (error) {
      // Rollback on error
      await client.query('ROLLBACK');
      throw error;
    } finally {
      // Release client back to pool
      client.release();
    }
  } catch (error: any) {
    logger.error('❌ Failed to apply product schema:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  applyProductSchema()
    .then(() => {
      logger.info('🎉 Schema application completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('💥 Schema application failed:', error);
      process.exit(1);
    });
}

export default applyProductSchema;
