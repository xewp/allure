import dotenv from 'dotenv';
import { createTransport } from 'nodemailer';

dotenv.config();

console.log('Testing Email Configuration...\n');
console.log('SMTP Host:', process.env.SMTP_HOST);
console.log('SMTP Port:', process.env.SMTP_PORT);
console.log('SMTP User:', process.env.SMTP_USER);
console.log('Email From:', process.env.EMAIL_FROM);
console.log('SMTP Pass:', process.env.SMTP_PASS ? '***configured***' : '❌ NOT SET');
console.log('');

const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Test connection
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ SMTP Connection Failed:');
    console.log(error.message);
    console.log('\nPlease check your Gmail App Password in .env file');
    process.exit(1);
  } else {
    console.log('✅ SMTP server is ready to send emails\n');
    
    // Send test email
    const mailOptions = {
      from: `"Power Allure Test" <${process.env.EMAIL_FROM}>`,
      to: process.env.SMTP_USER, // Send to yourself
      subject: 'Test Email - Nodemailer Configuration',
      html: `
        <h2>Success! 🎉</h2>
        <p>Your Gmail SMTP configuration is working correctly.</p>
        <p>You can now send OTP emails for your authentication system.</p>
        <hr>
        <small>Sent at: ${new Date().toLocaleString()}</small>
      `,
      text: 'Success! Your Gmail SMTP configuration is working correctly.',
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log('❌ Failed to send test email:');
        console.log(err.message);
        process.exit(1);
      } else {
        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('\nCheck your inbox at:', process.env.SMTP_USER);
        process.exit(0);
      }
    });
  }
});
