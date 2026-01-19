import sgMail from '@sendgrid/mail';
import { log } from '../utils/logger.js';

/**
 * Email service using SendGrid
 */

// Initialize SendGrid
if (!process.env.SENDGRID_API_KEY) {
  log.warn('SendGrid API key not found. Email functionality will not work.');
} else {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  log.info('SendGrid email service initialized');
}

/**
 * Send email using SendGrid
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 * @param {string} text - Plain text content
 */
const sendEmail = async (to, subject, html, text) => {
  if (!process.env.SENDGRID_API_KEY) {
    const error = new Error('SendGrid API key not configured');
    log.error('Cannot send email - SendGrid not configured', { to, subject });
    throw error;
  }

  const msg = {
    to,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_FROM,
      name: process.env.SENDGRID_FROM_NAME || 'Power Allure',
    },
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
    log.info('Email sent via SendGrid', { to, subject });
  } catch (error) {
    log.error('Failed to send email via SendGrid', {
      to,
      subject,
      error: error.message,
      errorCode: error.code,
      errorResponse: error.response ? JSON.stringify(error.response) : undefined,
      errorBody: error.response?.body ? JSON.stringify(error.response.body) : undefined,
      stack: error.stack
    });
    throw error;
  }
};

export { sendEmail };
