/**
 * PostgreSQL Database Connection for Billing System
 * AutoCare Advisor - Payment & Subscription System
 */

import { Pool } from 'pg';
import logger from '../utils/logger';

// Create PostgreSQL connection pool
const billingPool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    'postgresql://postgres:locoapp@localhost:5432/autocare_dev',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection on startup
billingPool
  .connect()
  .then(() => logger.info('✅ Billing PostgreSQL connected successfully'))
  .catch((err) =>
    logger.error('❌ Billing PostgreSQL connection failed:', err)
  );

export default billingPool;
