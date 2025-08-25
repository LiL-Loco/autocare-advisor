const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    'postgresql://postgres:locoapp@localhost:5432/autocare_dev',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function runScript() {
  try {
    console.log('Connecting to database...');
    const client = await pool.connect();

    console.log('Reading SQL script...');
    const sql = fs.readFileSync('./create_invitations_table.sql', 'utf8');

    console.log('Executing SQL script...');
    const result = await client.query(sql);
    console.log('Script executed successfully!');
    console.log('Result:', result.rows);

    client.release();

    // Test if table exists
    console.log('Testing if user_invitations table exists...');
    const testResult = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_invitations'"
    );
    console.log('Table exists:', testResult.rows.length > 0 ? 'YES' : 'NO');

    if (testResult.rows.length > 0) {
      // Show table structure
      const structureResult = await pool.query(
        "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'user_invitations' ORDER BY ordinal_position"
      );
      console.log('Table structure:');
      structureResult.rows.forEach((row) => {
        console.log(
          `  ${row.column_name}: ${row.data_type} (${
            row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'
          })`
        );
      });
    }

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

runScript();
