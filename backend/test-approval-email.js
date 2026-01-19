import dotenv from 'dotenv';
import { sendApprovalEmail } from './src/services/emailService.js';

// Load environment variables
dotenv.config();

console.log('\n🔍 Testing Approval Email Configuration...\n');
console.log('SMTP Configuration:');
console.log('  Host:', process.env.SMTP_HOST);
console.log('  Port:', process.env.SMTP_PORT);
console.log('  User:', process.env.SMTP_USER);
console.log('  Pass:', process.env.SMTP_PASS ? '***configured***' : '❌ NOT SET');
console.log('  From:', process.env.EMAIL_FROM);
console.log('\n');

// Test email address - replace with your test email
const TEST_EMAIL = process.env.SMTP_USER || 'your-test-email@gmail.com';

async function testApprovalEmail() {
  console.log('📧 Attempting to send approval email...\n');
  
  try {
    // Test approved email
    console.log('Testing APPROVED email to:', TEST_EMAIL);
    await sendApprovalEmail(TEST_EMAIL, true);
    console.log('✅ Approval email sent successfully!\n');
    
    // Wait 2 seconds before sending rejection email
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test rejected email
    console.log('Testing REJECTED email to:', TEST_EMAIL);
    await sendApprovalEmail(TEST_EMAIL, false);
    console.log('✅ Rejection email sent successfully!\n');
    
    console.log('🎉 All emails sent successfully!');
    console.log('\nCheck your inbox at:', TEST_EMAIL);
    
  } catch (error) {
    console.error('❌ Failed to send approval email:');
    console.error('Error:', error.message);
    console.error('\nFull error details:');
    console.error(error);
    
    if (error.code === 'EAUTH') {
      console.error('\n⚠️  Authentication failed. Please check:');
      console.error('   1. SMTP_USER and SMTP_PASS are correct');
      console.error('   2. Gmail "App Password" is being used (not regular password)');
      console.error('   3. 2-Step Verification is enabled in your Google Account');
    } else if (error.code === 'ECONNECTION') {
      console.error('\n⚠️  Connection failed. Please check:');
      console.error('   1. Internet connection is working');
      console.error('   2. SMTP_HOST and SMTP_PORT are correct');
      console.error('   3. Firewall is not blocking port 587');
    }
  }
}

testApprovalEmail();
