const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    'postgresql://postgres:locoapp@localhost:5432/autocare_dev',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function runBillingSchema() {
  const client = await pool.connect();
  try {
    console.log('📊 Setting up billing database schema...');

    const schemaSQL = fs.readFileSync(
      path.join(__dirname, 'backend/src/database/billing_schema.sql'),
      'utf8'
    );

    // Execute the SQL schema
    await client.query(schemaSQL);

    console.log('✅ Billing database schema created successfully!');
    console.log('📋 Created tables:');
    console.log('  - billing_customers');
    console.log('  - usage_records');
    console.log('  - payment_methods');
    console.log('  - subscription_history');
    console.log('  - invoices');
    console.log('  - webhook_events');
    console.log('  - promo_codes');
    console.log('  - promo_code_usage');
  } catch (error) {
    console.error('❌ Error creating billing schema:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runBillingSchema();
