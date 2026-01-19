import { createTransport } from 'nodemailer';
import { log } from '../utils/logger.js';

/**
 * Create and configure Nodemailer transporter
 * Uses SMTP configuration from environment variables
 */
const createTransporter = () => {
  return createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false, // true for 465, false for other ports (587 uses STARTTLS)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Send OTP verification email to user
 * @param {string} email - Recipient email address
 * @param {string} otp - 6-digit OTP code
 * @returns {Promise<void>}
 */
export const sendOTPEmail = async (email, otp) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"Power Allure" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Verify Your Email - Power Allure',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@700&display=swap');
          
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Inter', Arial, sans-serif; 
            line-height: 1.6; 
            color: #e5e5e5;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
            padding: 40px 20px;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: linear-gradient(to bottom, #1f1f1f, #0f0f0f);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(220, 184, 135, 0.15);
            border: 1px solid rgba(220, 184, 135, 0.2);
          }
          .header { 
            background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
            padding: 50px 40px;
            text-align: center;
            border-bottom: 2px solid #dcb887;
            position: relative;
          }
          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, #dcb887, transparent);
          }
          .logo { 
            font-family: 'Playfair Display', serif;
            font-size: 36px;
            font-weight: 700;
            background: linear-gradient(135deg, #f4e4c1 0%, #dcb887 50%, #c9a876 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 10px;
            letter-spacing: 1px;
          }
          .subtitle {
            color: #9ca3af;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          .content { 
            padding: 40px;
            background: rgba(31, 31, 31, 0.5);
          }
          .greeting {
            font-size: 18px;
            color: #dcb887;
            margin-bottom: 20px;
            font-weight: 600;
          }
          .message {
            color: #d1d5db;
            font-size: 15px;
            margin-bottom: 30px;
            line-height: 1.8;
          }
          .otp-container {
            background: linear-gradient(135deg, #2a2a2a, #1f1f1f);
            border: 2px solid #dcb887;
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
            position: relative;
            box-shadow: 0 4px 16px rgba(220, 184, 135, 0.2);
          }
          .otp-label {
            color: #9ca3af;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 15px;
          }
          .otp-code { 
            font-size: 42px; 
            font-weight: 700; 
            color: #dcb887;
            letter-spacing: 12px;
            font-family: 'Inter', monospace;
            text-shadow: 0 0 20px rgba(220, 184, 135, 0.3);
          }
          .expiry {
            background: rgba(220, 184, 135, 0.1);
            border-left: 3px solid #dcb887;
            padding: 15px 20px;
            margin: 25px 0;
            border-radius: 4px;
            color: #f3f4f6;
            font-size: 14px;
          }
          .next-steps {
            background: rgba(42, 42, 42, 0.5);
            padding: 20px;
            border-radius: 8px;
            margin-top: 30px;
            border: 1px solid rgba(220, 184, 135, 0.15);
          }
          .next-steps h3 {
            color: #dcb887;
            font-size: 16px;
            margin-bottom: 10px;
            font-weight: 600;
          }
          .next-steps p {
            color: #9ca3af;
            font-size: 14px;
            line-height: 1.6;
          }
          .warning { 
            background: rgba(239, 68, 68, 0.1);
            border-left: 3px solid #ef4444;
            padding: 15px 20px;
            margin-top: 25px;
            border-radius: 4px;
            font-size: 13px;
            color: #fca5a5;
          }
          .footer { 
            text-align: center; 
            padding: 30px 40px;
            background: #0a0a0a;
            border-top: 1px solid rgba(220, 184, 135, 0.1);
          }
          .footer p {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 5px;
          }
          .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(220, 184, 135, 0.3), transparent);
            margin: 25px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Power Allure</div>
            <div class="subtitle">Email Verification</div>
          </div>
          
          <div class="content">
            <div class="greeting">Welcome,</div>
            
            <p class="message">
              Thank you for registering with Power Allure. To complete your registration and verify your email address, please use the verification code below:
            </p>
            
            <div class="otp-container">
              <div class="otp-label">Your Verification Code</div>
              <div class="otp-code">${otp}</div>
            </div>
            
            <div class="expiry">
              ⏰ <strong>This code will expire in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.</strong> Please use it promptly to complete your verification.
            </div>
            
            <div class="divider"></div>
            
            <div class="next-steps">
              <h3>What happens next?</h3>
              <p>Once verified, your account will be reviewed by our administrators. You'll receive a confirmation email once your account is approved.</p>
            </div>
            
            <div class="warning">
              ⚠️ <strong>Security Notice:</strong> If you didn't request this verification code, please ignore this email. Your account remains secure.
            </div>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Power Allure. All Rights Reserved.</p>
            <p style="color: #4b5563; margin-top: 5px;">Premium Model Management Services</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Power Allure - Email Verification
      
      Welcome!
      
      Thank you for registering with Power Allure. Your verification code is:
      
      ${otp}
      
      This code will expire in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.
      
      What happens next?
      Once verified, your account will be reviewed by our administrators. You'll receive a confirmation email once approved.
      
      Security Notice: If you didn't request this code, please ignore this email.
      
      © ${new Date().getFullYear()} Power Allure. All Rights Reserved.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    log.info('OTP email sent successfully', { email });
  } catch (error) {
    log.error('Failed to send OTP email', { 
      email, 
      error: error.message,
      code: error.code,
      response: error.response,
      command: error.command 
    });
    throw new Error('Failed to send verification email');
  }
};

/**
 * Send account approval notification email
 * @param {string} email - User email address
 * @param {boolean} approved - Whether account was approved or rejected
 * @returns {Promise<void>}
 */
export const sendApprovalEmail = async (email, approved) => {
  const transporter = createTransporter();
  
  const subject = approved 
    ? '🎉 Welcome to Power Allure - Account Approved!' 
    : 'Power Allure - Account Registration Update';
    
  const mailOptions = {
    from: `"Power Allure" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject,
    html: approved ? `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@700&display=swap');
          
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Inter', Arial, sans-serif; 
            line-height: 1.6; 
            color: #e5e5e5;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
            padding: 40px 20px;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: linear-gradient(to bottom, #1f1f1f, #0f0f0f);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(220, 184, 135, 0.15);
            border: 1px solid rgba(220, 184, 135, 0.2);
          }
          .header { 
            background: linear-gradient(135deg, #dcb887 0%, #c9a876 100%);
            padding: 50px 40px;
            text-align: center;
            position: relative;
          }
          .success-icon { 
            font-size: 64px;
            margin-bottom: 15px;
            animation: bounce 1s ease;
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .logo { 
            font-family: 'Playfair Display', serif;
            font-size: 32px;
            font-weight: 700;
            color: #0a0a0a;
            margin-bottom: 5px;
            letter-spacing: 1px;
          }
          .subtitle {
            color: #1f1f1f;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-weight: 600;
          }
          .content { 
            padding: 40px;
            background: rgba(31, 31, 31, 0.5);
          }
          .greeting {
            font-size: 24px;
            color: #dcb887;
            margin-bottom: 20px;
            font-weight: 700;
            font-family: 'Playfair Display', serif;
          }
          .message {
            color: #d1d5db;
            font-size: 16px;
            margin-bottom: 20px;
            line-height: 1.8;
          }
          .highlight-box {
            background: linear-gradient(135deg, #2a2a2a, #1f1f1f);
            border: 2px solid #dcb887;
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
            text-align: center;
          }
          .highlight-box h3 {
            color: #dcb887;
            font-size: 20px;
            margin-bottom: 15px;
            font-family: 'Playfair Display', serif;
          }
          .highlight-box p {
            color: #9ca3af;
            font-size: 15px;
            line-height: 1.6;
          }
          .cta-button { 
            display: inline-block;
            background: linear-gradient(135deg, #dcb887 0%, #c9a876 100%);
            color: #0a0a0a;
            padding: 16px 40px;
            text-decoration: none;
            border-radius: 50px;
            margin-top: 30px;
            font-weight: 700;
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 4px 16px rgba(220, 184, 135, 0.3);
            transition: all 0.3s ease;
          }
          .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(220, 184, 135, 0.4);
          }
          .features {
            display: grid;
            gap: 15px;
            margin: 30px 0;
          }
          .feature {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 15px;
            background: rgba(42, 42, 42, 0.3);
            border-radius: 8px;
            border-left: 3px solid #dcb887;
          }
          .feature-icon {
            font-size: 20px;
            flex-shrink: 0;
          }
          .feature-text {
            color: #d1d5db;
            font-size: 14px;
          }
          .footer { 
            text-align: center; 
            padding: 30px 40px;
            background: #0a0a0a;
            border-top: 1px solid rgba(220, 184, 135, 0.1);
          }
          .footer p {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 5px;
          }
          .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(220, 184, 135, 0.3), transparent);
            margin: 30px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="success-icon">✓</div>
            <div class="logo">Power Allure</div>
            <div class="subtitle">Account Approved</div>
          </div>
          
          <div class="content">
            <div class="greeting">Welcome to Power Allure!</div>
            
            <p class="message">
              Congratulations! Your account has been reviewed and approved by our administrators. You now have full access to our premium platform.
            </p>
            
            <div class="highlight-box">
              <h3>You're All Set!</h3>
              <p>Your account is active and ready to use. Sign in now to explore our exclusive features and services.</p>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URLS?.split(',')[0] || 'http://localhost:5173'}/login" class="cta-button">
                Sign In to Your Account
              </a>
            </div>
            
            <div class="divider"></div>
            
            <div class="features">
              <div class="feature">
                <div class="feature-icon">🌟</div>
                <div class="feature-text">
                  <strong>Browse Models:</strong> Access our curated collection of professional models
                </div>
              </div>
              <div class="feature">
                <div class="feature-icon">❤️</div>
                <div class="feature-text">
                  <strong>Save Favorites:</strong> Create your personalized favorites list
                </div>
              </div>
              <div class="feature">
                <div class="feature-icon">📅</div>
                <div class="feature-text">
                  <strong>Book Services:</strong> Request bookings for your events seamlessly
                </div>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Power Allure. All Rights Reserved.</p>
            <p style="color: #4b5563; margin-top: 5px;">Premium Model Management Services</p>
          </div>
        </div>
      </body>
      </html>
    ` : `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@700&display=swap');
          
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Inter', Arial, sans-serif; 
            line-height: 1.6; 
            color: #e5e5e5;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
            padding: 40px 20px;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: linear-gradient(to bottom, #1f1f1f, #0f0f0f);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(239, 68, 68, 0.15);
            border: 1px solid rgba(239, 68, 68, 0.2);
          }
          .header { 
            background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%);
            padding: 50px 40px;
            text-align: center;
          }
          .logo { 
            font-family: 'Playfair Display', serif;
            font-size: 32px;
            font-weight: 700;
            color: #fca5a5;
            margin-bottom: 10px;
            letter-spacing: 1px;
          }
          .subtitle {
            color: #fecaca;
            font-size: 14px;
            textTransform: uppercase;
            letter-spacing: 2px;
          }
          .content { 
            padding: 40px;
            background: rgba(31, 31, 31, 0.5);
          }
          .message {
            color: #d1d5db;
            font-size: 15px;
            margin-bottom: 15px;
            line-height: 1.8;
          }
          .footer { 
            text-align: center; 
            padding: 30px 40px;
            background: #0a0a0a;
            border-top: 1px solid rgba(239, 68, 68, 0.1);
          }
          .footer p {
            font-size: 12px;
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Power Allure</div>
            <div class="subtitle">Account Registration Update</div>
          </div>
          
          <div class="content">
            <p class="message">Thank you for your interest in Power Allure.</p>
            <p class="message">Unfortunately, we are unable to approve your account at this time.</p>
            <p class="message">If you believe this is an error or have questions, please contact our support team.</p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Power Allure. All Rights Reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    log.info('Approval email sent successfully', { email, approved });
  } catch (error) {
    log.error('Failed to send approval email', { email, error: error.message });
    // Don't throw error here - approval email is optional
  }
};

/**
 * Send password reset email with reset link
 * @param {string} email - User email address
 * @param {string} token - Reset token
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export const sendPasswordResetEmail = async (email, token, userId) => {
  const transporter = createTransporter();
  
  // Create reset URL using environment variable (production) or localhost (development)
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const resetUrl = `${clientUrl}/reset-password?token=${token}&userId=${userId}`;
  
  const mailOptions = {
    from: `"Power Allure" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Reset Your Password - Power Allure',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@700&display=swap');
          
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Inter', Arial, sans-serif; 
            line-height: 1.6; 
            color: #e5e5e5;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
            padding: 40px 20px;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: linear-gradient(to bottom, #1f1f1f, #0f0f0f);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(220, 184, 135, 0.15);
            border: 1px solid rgba(220, 184, 135, 0.2);
          }
          .header { 
            background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
            padding: 50px 40px;
            text-align: center;
            border-bottom: 2px solid #dcb887;
            position: relative;
          }
          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, #dcb887, transparent);
          }
          .logo { 
            font-family: 'Playfair Display', serif;
            font-size: 36px;
            font-weight: 700;
            background: linear-gradient(135deg, #f4e4c1 0%, #dcb887 50%, #c9a876 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 10px;
            letter-spacing: 1px;
          }
          .subtitle {
            color: #9ca3af;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          .content { 
            padding: 40px;
            background: rgba(31, 31, 31, 0.5);
          }
          .greeting {
            font-size: 18px;
            color: #dcb887;
            margin-bottom: 20px;
            font-weight: 600;
          }
          .message {
            color: #d1d5db;
            font-size: 15px;
            margin-bottom: 30px;
            line-height: 1.8;
          }
          .button-container {
            text-align: center;
            margin: 40px 0;
          }
          .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #dcb887 0%, #c9a876 100%);
            color: #0a0a0a;
            padding: 18px 50px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 700;
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 4px 16px rgba(220, 184, 135, 0.3);
            transition: all 0.3s ease;
          }
          .reset-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(220, 184, 135, 0.4);
          }
          .expiry {
            background: rgba(220, 184, 135, 0.1);
            border-left: 3px solid #dcb887;
            padding: 15px 20px;
            margin: 25px 0;
            border-radius: 4px;
            color: #f3f4f6;
            font-size: 14px;
          }
          .warning { 
            background: rgba(239, 68, 68, 0.1);
            border-left: 3px solid #ef4444;
            padding: 15px 20px;
            margin-top: 25px;
            border-radius: 4px;
            font-size: 13px;
            color: #fca5a5;
          }
          .footer { 
            text-align: center; 
            padding: 30px 40px;
            background: #0a0a0a;
            border-top: 1px solid rgba(220, 184, 135, 0.1);
          }
          .footer p {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 5px;
          }
          .footer a {
            color: #dcb887;
            text-decoration: none;
          }
          .alt-link {
            background: rgba(42, 42, 42, 0.5);
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            word-break: break-all;
            font-size: 12px;
            color: #9ca3af;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Power Allure</div>
            <div class="subtitle">Password Reset Request</div>
          </div>
          
          <div class="content">
            <div class="greeting">Password Reset Requested</div>
            
            <p class="message">
              We received a request to reset your password for your Power Allure account. Click the button below to create a new password:
            </p>
            
            <div class="button-container">
              <a href="${resetUrl}" class="reset-button">Reset My Password</a>
            </div>
            
            <div class="expiry">
              ⏰ <strong>This link will expire in 15 minutes.</strong> Please use it promptly to reset your password.
            </div>
            
            <div class="alt-link">
              <strong>If the button doesn't work, copy and paste this URL into your browser:</strong><br>
              ${resetUrl}
            </div>
            
            <div class="warning">
              ⚠️ <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your account remains secure.
            </div>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Power Allure. All Rights Reserved.</p>
            <p style="color: #4b5563; margin-top: 5px;">Premium Model Management Services</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Power Allure - Password Reset Request
      
      We received a request to reset your password.
      
      Reset your password by visiting this link:
      ${resetUrl}
      
      This link will expire in 15 minutes.
      
      If you didn't request this password reset, please ignore this email.
      
      © ${new Date().getFullYear()} Power Allure. All Rights Reserved.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    log.info('Password reset email sent successfully', { email });
  } catch (error) {
    log.error('Failed to send password reset email', { 
      email, 
      error: error.message,
      code: error.code,
      response: error.response,
      command: error.command 
    });
    throw new Error('Failed to send password reset email');
  }
};

/**
 * Send password reset confirmation email
 * @param {string} email - User email address
 * @returns {Promise<void>}
 */
export const sendPasswordResetConfirmation = async (email) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"Power Allure" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: '✓ Password Successfully Changed - Power Allure',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@700&display=swap');
          
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Inter', Arial, sans-serif; 
            line-height: 1.6; 
            color: #e5e5e5;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
            padding: 40px 20px;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: linear-gradient(to bottom, #1f1f1f, #0f0f0f);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(220, 184, 135, 0.15);
            border: 1px solid rgba(220, 184, 135, 0.2);
          }
          .header { 
            background: linear-gradient(135deg, #dcb887 0%, #c9a876 100%);
            padding: 50px 40px;
            text-align: center;
          }
          .success-icon { 
            font-size: 64px;
            margin-bottom: 15px;
          }
          .logo { 
            font-family: 'Playfair Display', serif;
            font-size: 32px;
            font-weight: 700;
            color: #0a0a0a;
            margin-bottom: 5px;
            letter-spacing: 1px;
          }
          .subtitle {
            color: #1f1f1f;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-weight: 600;
          }
          .content { 
            padding: 40px;
            background: rgba(31, 31, 31, 0.5);
          }
          .message {
            color: #d1d5db;
            font-size: 15px;
            margin-bottom: 20px;
            line-height: 1.8;
          }
          .info-box {
            background: rgba(220, 184, 135, 0.1);
            border-left: 3px solid #dcb887;
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 4px;
            color: #f3f4f6;
            font-size: 14px;
          }
          .footer { 
            text-align: center; 
            padding: 30px 40px;
            background: #0a0a0a;
            border-top: 1px solid rgba(220, 184, 135, 0.1);
          }
          .footer p {
            font-size: 12px;
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="success-icon">✓</div>
            <div class="logo">Power Allure</div>
            <div class="subtitle">Password Changed</div>
          </div>
          
          <div class="content">
            <p class="message">
              Your password has been successfully changed. You can now log in to your Power Allure account with your new password.
            </p>
            
            <div class="info-box">
              🔒 <strong>Security Tip:</strong> Never share your password with anyone. Power Allure will never ask for your password via email.
            </div>
            
            <p class="message">
              If you didn't make this change, please contact our support team immediately.
            </p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Power Allure. All Rights Reserved.</p>
            <p style="color: #4b5563; margin-top: 5px;">Premium Model Management Services</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Power Allure - Password Changed Successfully
      
      Your password has been successfully changed.
      
      You can now log in with your new password.
      
      If you didn't make this change, please contact support immediately.
      
      © ${new Date().getFullYear()} Power Allure. All Rights Reserved.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    log.info('Password reset confirmation email sent successfully', { email });
  } catch (error) {
    log.error('Failed to send password reset confirmation', { email, error: error.message });
    // Don't throw error - confirmation email is optional
  }
};

/**
 * Verify email service configuration
 * @returns {Promise<boolean>} True if connection successful
 */
export const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    log.info('Email service is ready');
    return true;
  } catch (error) {
    log.error('Email service configuration error', { error: error.message });
    return false;
  }
};
