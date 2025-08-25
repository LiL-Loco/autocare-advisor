const bcrypt = require('bcrypt');
const { Pool } = require('pg');

async function createAdmin() {
  const pool = new Pool({
    connectionString: 'postgresql://postgres:locoapp@localhost:5433/postgres',
  });

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 12);
    console.log('Generated hash:', hashedPassword);

    // Insert the user
    const query = `INSERT INTO users (email, password_hash, role, first_name, last_name, is_active, is_email_verified) 
                   VALUES ($1, $2, $3, $4, $5, $6, $7) 
                   RETURNING email, role`;
    const result = await pool.query(query, [
      'admin@autocare-advisor.com',
      hashedPassword,
      'admin',
      'System',
      'Administrator',
      true,
      true,
    ]);

    console.log('Created user:', result.rows[0]);

    // Test the password
    const testQuery = `SELECT password_hash FROM users WHERE email = $1`;
    const testResult = await pool.query(testQuery, [
      'admin@autocare-advisor.com',
    ]);
    const storedHash = testResult.rows[0].password_hash;

    console.log('Stored hash length:', storedHash.length);
    console.log('Hash starts with:', storedHash.substring(0, 20) + '...');

    const isMatch = await bcrypt.compare('admin123', storedHash);
    console.log('Password verification:', isMatch);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

createAdmin();
