const pool = require('./backend/src/services/userService.ts').default;
const fs = require('fs');

async function runScript() {
  try {
    const client = await pool.connect();
    const sql = fs.readFileSync('./create_invitations_table.sql', 'utf8');
    console.log('Executing SQL script...');
    const result = await client.query(sql);
    console.log('Result:', result);
    client.release();

    // Test if table exists
    const testResult = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_invitations'"
    );
    console.log('Table exists:', testResult.rows.length > 0 ? 'YES' : 'NO');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

runScript();
