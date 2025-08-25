// Database Creation Script
const { Pool } = require('pg');

async function createDatabase() {
  // First connect to default postgres database to create autocare_dev
  const pool = new Pool({
    user: 'postgres',
    password: 'locoapp',
    host: 'localhost',
    database: 'postgres', // Connect to default database
    port: 5432,
  });

  try {
    console.log('📦 Creating autocare_dev database...');

    // Check if database exists
    const checkResult = await pool.query(
      "SELECT 1 FROM pg_database WHERE datname = 'autocare_dev'"
    );

    if (checkResult.rows.length === 0) {
      await pool.query('CREATE DATABASE autocare_dev');
      console.log('✅ Database autocare_dev created successfully');
    } else {
      console.log('ℹ️  Database autocare_dev already exists');
    }
  } catch (error) {
    console.error('❌ Database creation error:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

createDatabase().catch(console.error);
