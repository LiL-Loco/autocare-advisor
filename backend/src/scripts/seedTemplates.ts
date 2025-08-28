import { seedEmailTemplates } from '../services/emailTemplates';
import mongoConnection, { initializeDatabase } from '../database/mongodb';
import billingPool from '../database/postgres';

/**
 * Script to seed email templates in the database
 * Run with: npm run scripts:seed-templates
 */

async function main() {
  console.log('🌱 Starting email template seeding process...\n');

  try {
    // Connect to databases
    console.log('📡 Connecting to databases...');
    await initializeDatabase();
    console.log('✅ Database connections established\n');

    // Seed email templates
    console.log('📧 Seeding email templates...');
    const result = await seedEmailTemplates();
    
    console.log('\n📊 Seeding Results:');
    console.log(`   ✅ Templates created: ${result.created}`);
    console.log(`   ⏭️  Templates skipped: ${result.skipped}`);
    console.log(`   📝 Total templates: ${result.total}\n`);

    if (result.created > 0) {
      console.log('🎉 Email templates successfully seeded!');
      console.log('\n📋 Available Template Categories:');
      console.log('   • Partner Onboarding (7-step sequence)');
      console.log('   • Business Development (cold outreach)');
      console.log('   • Transactional (auth, notifications)');
    } else {
      console.log('ℹ️  All templates already exist in database.');
    }

    console.log('\n🚀 Next Steps:');
    console.log('   1. Test templates with: npm run scripts:test-templates');
    console.log('   2. Send test emails via API: POST /api/emails/send-template');
    console.log('   3. View templates in admin dashboard');

  } catch (error) {
    console.error('\n❌ Error during seeding process:');
    console.error(error);
    process.exit(1);
  }

  process.exit(0);
}

// Handle script execution
const isMainModule = process.argv[1]?.includes('seedTemplates');
if (isMainModule) {
  main();
}

export { main as seedTemplates };