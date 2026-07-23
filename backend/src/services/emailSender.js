import { Resend } from 'resend';
import { log } from '../utils/logger.js';

/**
 * Email service using Resend
 */

let resend;

// Initialize Resend
if (!process.env.RESEND_API_KEY) {
  log.warn('Resend API key not found. Email functionality will not work.');
} else {
  resend = new Resend(process.env.RESEND_API_KEY);
  log.info('Resend email service initialized');
}

/**
 * Send email using Resend
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 * @param {string} text - Plain text content
 */
const sendEmail = async (to, subject, html, text) => {
  if (!process.env.RESEND_API_KEY || !resend) {
    const error = new Error('Resend API key not configured');
    log.error('Cannot send email - Resend not configured', { to, subject });
    throw error;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: [to],
      subject,
      html,
      text,
    });

    if (error) {
      log.error('Failed to send email via Resend API', {
        to,
        subject,
        error: error.message,
      });
      throw new Error(error.message);
    }

    log.info('Email sent via Resend', { to, subject, id: data?.id });
  } catch (error) {
    log.error('Failed to send email via Resend (Exception)', {
      to,
      subject,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
};

export { sendEmail };
