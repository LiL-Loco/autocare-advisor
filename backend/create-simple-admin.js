const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function createSimpleAdmin() {
  try {
    // Hash the password
    const plainPassword = 'admin123!';
    const hashedPassword = await bcrypt.hash(plainPassword, 12);

    console.log('🔐 Admin User Creation');
    console.log('Email: admin@autocare.de');
    console.log('Password:', plainPassword);
    console.log('Hash:', hashedPassword);

    // Create a simple admin user file
    const adminUser = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'admin@autocare.de',
      password_hash: hashedPassword,
      role: 'admin',
      first_name: 'System',
      last_name: 'Administrator',
      is_active: true,
      is_email_verified: true,
      created_at: new Date().toISOString(),
    };

    // Write to file for fallback
    const adminFile = path.join(__dirname, 'admin-user.json');
    fs.writeFileSync(adminFile, JSON.stringify(adminUser, null, 2));

    console.log('\n✅ Admin user data saved to admin-user.json');
    console.log('📋 Use these credentials to login:');
    console.log('   Email: admin@autocare.de');
    console.log('   Password: admin123!');

    return adminUser;
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  }
}

createSimpleAdmin();
