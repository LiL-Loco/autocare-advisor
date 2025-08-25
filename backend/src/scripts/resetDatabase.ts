/**
 * Database Reset Script - AutoCare Advisor
 *
 * Drops all collections and recreates them with proper indexes
 */

import mongoose from 'mongoose';
import Product from '../models/Product';
import logger from '../utils/logger';

export async function resetDatabase(): Promise<void> {
  try {
    logger.info('🗄️ Starting database reset...');

    // Drop the products collection entirely to remove all data and indexes
    await mongoose.connection.db.dropCollection('products').catch(() => {
      logger.info('Products collection does not exist, skipping drop');
    });

    logger.info('✅ Dropped products collection');

    // Recreate the collection by ensuring indexes
    await Product.createIndexes();

    logger.info('✅ Recreated product indexes');
    logger.info('🎯 Database reset completed successfully');
  } catch (error: any) {
    logger.error('❌ Error resetting database:', error);
    throw error;
  }
}

export default resetDatabase;
