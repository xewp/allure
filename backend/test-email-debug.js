import dotenv from 'dotenv';
dotenv.config();

import { sendOTPEmail } from './src/services/emailService.js';
import { log } from './src/utils/logger.js';

// Test email sending
const testEmail = async () => {
  try {
    console.log('Testing email configuration...');
    console.log('SMTP_HOST:', process.env.SMTP_HOST);
    console.log('SMTP_PORT:', process.env.SMTP_PORT);
    console.log('SMTP_USER:', process.env.SMTP_USER);
    console.log('EMAIL_FROM:', process.env.EMAIL_FROM);
    console.log('');
    
    const testOTP = '123456';
    const testEmailAddress = process.env.SMTP_USER; // Send to self for testing
    
    console.log(`Sending test OTP email to ${testEmailAddress}...`);
    await sendOTPEmail(testEmailAddress, testOTP);
    
    console.log('✅ Email sent successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Email sending failed:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error response:', error.response);
    console.error('Error command:', error.command);
    console.error('Full error:', error);
    process.exit(1);
  }
};

testEmail();
