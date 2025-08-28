import { templateEngine } from '../services/templateEngine';
import { PARTNER_ONBOARDING_TEMPLATES, BUSINESS_DEVELOPMENT_TEMPLATES, TRANSACTIONAL_TEMPLATES } from '../services/emailTemplates';

/**
 * Test script for email templates
 * Run with: npm run scripts:test-templates
 */

// Test data for template rendering
const TEST_DATA = {
  user: {
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max.mustermann@example.com',
    company: 'AutoPflege Max GmbH'
  },
  partner: {
    companyName: 'AutoPflege Max GmbH',
    industry: 'Autopflege',
    website: 'https://autopflege-max.de',
    contactPerson: 'Max Mustermann'
  },
  messageId: 'test-msg-12345',
  resetUrl: 'https://autocare-advisor.com/auth/reset-password?token=test-token-123'
};

async function testTemplate(template: any, testData: any) {
  console.log(`\n🧪 Testing template: ${template.name}`);
  console.log(`   Subject: ${template.subject}`);
  
  try {
    // Test subject rendering
    const renderedSubject = templateEngine.renderSubject(template.subject, testData);
    console.log(`   ✅ Subject rendered: "${renderedSubject}"`);
    
    // Test HTML content rendering
    const renderedHtml = templateEngine.renderHtml(template.htmlContent, testData);
    console.log(`   ✅ HTML content rendered (${renderedHtml.length} chars)`);
    
    // Test text content rendering
    const renderedText = templateEngine.renderText(template.textContent, testData);
    console.log(`   ✅ Text content rendered (${renderedText.length} chars)`);
    
    // Test template validation
    const validation = templateEngine.validateTemplate(template.htmlContent);
    if (validation.valid) {
      console.log(`   ✅ Template validation passed`);
    } else {
      console.log(`   ⚠️  Template validation warnings: ${validation.errors.join(', ')}`);
    }
    
    return { success: true, template: template.name };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.log(`   ❌ Template test failed: ${errorMessage}`);
    return { success: false, template: template.name, error: errorMessage };
  }
}

async function testAllTemplates() {
  console.log('🧪 Starting email template testing...\n');

  const allTemplates = [
    ...PARTNER_ONBOARDING_TEMPLATES,
    ...BUSINESS_DEVELOPMENT_TEMPLATES,
    ...TRANSACTIONAL_TEMPLATES
  ];

  const results = {
    passed: 0,
    failed: 0,
    total: allTemplates.length,
    failures: [] as any[]
  };

  console.log(`📝 Testing ${allTemplates.length} email templates...\n`);

  for (const template of allTemplates) {
    const result = await testTemplate(template, TEST_DATA);
    
    if (result.success) {
      results.passed++;
    } else {
      results.failed++;
      results.failures.push(result);
    }
  }

  // Print summary
  console.log('\n📊 Test Results Summary:');
  console.log(`   ✅ Passed: ${results.passed}/${results.total}`);
  console.log(`   ❌ Failed: ${results.failed}/${results.total}`);
  
  if (results.failures.length > 0) {
    console.log('\n❌ Failed Templates:');
    results.failures.forEach(failure => {
      console.log(`   • ${failure.template}: ${failure.error}`);
    });
  }

  return results;
}

async function testSpecificFeatures() {
  console.log('\n🔧 Testing specific template features...\n');

  try {
    // Test custom Handlebars helpers
    console.log('🧪 Testing Handlebars helpers:');
    
    // Currency helper
    const currencyTest = templateEngine.renderHtml('{{currency 29.99}}', {});
    console.log(`   ✅ Currency helper: "${currencyTest}"`);
    
    // Date helper
    const dateTest = templateEngine.renderHtml('{{formatDate "2024-01-15"}}', {});
    console.log(`   ✅ Date helper: "${dateTest}"`);
    
    // URL tracking helper
    const urlTest = templateEngine.renderHtml('{{trackClick "https://example.com" "msg123"}}', {});
    console.log(`   ✅ URL tracking helper: "${urlTest}"`);
    
    // Unsubscribe helper
    const unsubTest = templateEngine.renderHtml('{{unsubscribeUrl "test@example.com" "newsletter"}}', {});
    console.log(`   ✅ Unsubscribe helper: "${unsubTest}"`);
    
    console.log('\n✅ All helper tests passed!');
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.log(`\n❌ Helper test failed: ${errorMessage}`);
    throw error;
  }
}

async function generatePreviewHtml() {
  console.log('\n📄 Generating preview HTML files...\n');

  const outputDir = './template-previews';
  const fs = await import('fs/promises');
  
  try {
    // Create output directory
    try {
      await fs.mkdir(outputDir, { recursive: true });
    } catch (err) {
      // Directory might already exist
    }

    const allTemplates = [
      ...PARTNER_ONBOARDING_TEMPLATES,
      ...BUSINESS_DEVELOPMENT_TEMPLATES,
      ...TRANSACTIONAL_TEMPLATES
    ];

    for (const template of allTemplates) {
      try {
        const renderedHtml = templateEngine.renderHtml(template.htmlContent, TEST_DATA);
        const filename = template.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.html';
        const filepath = `${outputDir}/${filename}`;
        
        await fs.writeFile(filepath, renderedHtml);
        console.log(`   ✅ Generated: ${filename}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.log(`   ❌ Failed to generate ${template.name}: ${errorMessage}`);
      }
    }

    console.log(`\n📁 Preview files saved to: ${outputDir}/`);
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.log(`\n❌ Preview generation failed: ${errorMessage}`);
  }
}

async function main() {
  try {
    // Test all templates
    const results = await testAllTemplates();
    
    // Test specific features
    await testSpecificFeatures();
    
    // Generate preview HTML files
    await generatePreviewHtml();
    
    if (results.failed === 0) {
      console.log('\n🎉 All template tests passed successfully!');
      console.log('\n🚀 Next Steps:');
      console.log('   1. Review generated preview HTML files');
      console.log('   2. Send test emails via API: POST /api/emails/send-template');
      console.log('   3. Set up automated email sequences');
    } else {
      console.log(`\n⚠️  ${results.failed} templates have issues that need to be fixed.`);
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ Template testing failed:');
    console.error(error);
    process.exit(1);
  }
}

// Handle script execution
const isMainModule = process.argv[1]?.includes('testTemplates');
if (isMainModule) {
  main();
}

export { main as testTemplates };