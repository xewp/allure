import { sendEmail } from './emailSender.js';
import { log } from '../utils/logger.js';

/**
 * Send booking submission confirmation email
 */
export const sendBookingSubmittedEmail = async (email, bookingData) => {
  const subject = 'Booking Request Received - Power Allure';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #e5e5e5; background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%); padding: 40px 20px; }
        .container { max-width: 600px; margin: 0 auto; background: linear-gradient(to bottom, #1f1f1f, #0f0f0f); border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(220, 184, 135, 0.15); border: 1px solid rgba(220, 184, 135, 0.2); }
        .header { background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%); padding: 50px 40px; text-align: center; border-bottom: 2px solid #dcb887; }
        .logo { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 700; background: linear-gradient(135deg, #f4e4c1 0%, #dcb887 50%, #c9a876 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 10px; }
        .subtitle { color: #9ca3af; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; }
        .content { padding: 40px; background: rgba(31, 31, 31, 0.5); }
        .greeting { font-size: 18px; color: #dcb887; margin-bottom: 20px; font-weight: 600; }
        .message { color: #d1d5db; font-size: 15px; margin-bottom: 20px; line-height: 1.8; }
        .status-badge { display: inline-block; background: rgba(234, 179, 8, 0.2); color: #fbbf24; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 600; border: 2px solid #fbbf24; }
        .details-box { background: linear-gradient(135deg, #2a2a2a, #1f1f1f); border: 2px solid #dcb887; border-radius: 12px; padding: 25px; margin: 25px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(220, 184, 135, 0.1); }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { color: #9ca3af; font-size: 14px; }
        .detail-value { color: #dcb887; font-weight: 600; font-size: 14px; }
        .footer { text-align: center; padding: 30px 40px; background: #0a0a0a; border-top: 1px solid rgba(220, 184, 135, 0.1); }
        .footer p { font-size: 12px; color: #6b7280; margin-bottom: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Power Allure</div>
          <div class="subtitle">Booking Request</div>
        </div>
        <div class="content">
          <div class="greeting">Hello ${bookingData.userName},</div>
          <p class="message">Thank you for your booking request. We have received your submission and it is currently pending admin approval.</p>
          <div style="text-align: center; margin: 25px 0;">
            <span class="status-badge">⏳ PENDING APPROVAL</span>
          </div>
          <div class="details-box">
            <div class="detail-row"><span class="detail-label">Model:</span><span class="detail-value">${bookingData.modelName}</span></div>
            <div class="detail-row"><span class="detail-label">Event:</span><span class="detail-value">${bookingData.event}</span></div>
            <div class="detail-row"><span class="detail-label">Date:</span><span class="detail-value">${new Date(bookingData.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
            <div class="detail-row"><span class="detail-label">Time:</span><span class="detail-value">${bookingData.eventTime}</span></div>
            ${bookingData.company ? `<div class="detail-row"><span class="detail-label">Company:</span><span class="detail-value">${bookingData.company}</span></div>` : ''}
          </div>
          <p class="message">You will receive a confirmation email once your booking has been reviewed and approved by our team.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Power Allure. All Rights Reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `Power Allure - Booking Request Received\n\nHello ${bookingData.userName},\n\nYour booking request has been received:\nModel: ${bookingData.modelName}\nEvent: ${bookingData.event}\nDate: ${bookingData.eventDate}\nTime: ${bookingData.eventTime}\n\nStatus: Pending Approval\n\n© ${new Date().getFullYear()} Power Allure`;

  try {
    await sendEmail(email, subject, html, text);
    log.info('Booking submitted email sent', { email });
  } catch (error) {
    log.error('Failed to send booking submitted email', { email, error: error.message });
  }
};

/**
 * Send booking confirmed email
 */
export const sendBookingConfirmedEmail = async (email, bookingData) => {
  const subject = '✓ Booking Confirmed - Power Allure';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #e5e5e5; background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%); padding: 40px 20px; }
        .container { max-width: 600px; margin: 0 auto; background: linear-gradient(to bottom, #1f1f1f, #0f0f0f); border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(220, 184, 135, 0.15); border: 1px solid rgba(220, 184, 135, 0.2); }
        .header { background: linear-gradient(135deg, #dcb887 0%, #c9a876 100%); padding: 50px 40px; text-align: center; }
        .success-icon { font-size: 64px; margin-bottom: 15px; }
        .logo { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; color: #0a0a0a; margin-bottom: 5px; }
        .subtitle { color: #1f1f1f; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; }
        .content { padding: 40px; background: rgba(31, 31, 31, 0.5); }
        .greeting { font-size: 24px; color: #dcb887; margin-bottom: 20px; font-weight: 700; font-family: 'Playfair Display', serif; }
        .message { color: #d1d5db; font-size: 16px; margin-bottom: 20px; line-height: 1.8; }
        .status-badge { display: inline-block; background: rgba(34, 197, 94, 0.2); color: #4ade80; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 600; border: 2px solid #4ade80; }
        .details-box { background: linear-gradient(135deg, #2a2a2a, #1f1f1f); border: 2px solid #dcb887; border-radius: 12px; padding: 25px; margin: 25px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(220, 184, 135, 0.1); }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { color: #9ca3af; font-size: 14px; }
        .detail-value { color: #dcb887; font-weight: 600; font-size: 14px; }
        .footer { text-align: center; padding: 30px 40px; background: #0a0a0a; border-top: 1px solid rgba(220, 184, 135, 0.1); }
        .footer p { font-size: 12px; color: #6b7280; margin-bottom: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="success-icon">✓</div>
          <div class="logo">Power Allure</div>
          <div class="subtitle">Booking Confirmed</div>
        </div>
        <div class="content">
          <div class="greeting">Congratulations ${bookingData.userName}!</div>
          <p class="message">Your booking has been confirmed. We look forward to working with you!</p>
          <div style="text-align: center; margin: 25px 0;">
            <span class="status-badge">✓ CONFIRMED</span>
          </div>
          <div class="details-box">
            <div class="detail-row"><span class="detail-label">Model:</span><span class="detail-value">${bookingData.modelName}</span></div>
            <div class="detail-row"><span class="detail-label">Event:</span><span class="detail-value">${bookingData.event}</span></div>
            <div class="detail-row"><span class="detail-label">Date:</span><span class="detail-value">${new Date(bookingData.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
            <div class="detail-row"><span class="detail-label">Time:</span><span class="detail-value">${bookingData.eventTime}</span></div>
            ${bookingData.company ? `<div class="detail-row"><span class="detail-label">Company:</span><span class="detail-value">${bookingData.company}</span></div>` : ''}
          </div>
          <p class="message">If you have any questions, please don't hesitate to contact us.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Power Allure. All Rights Reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `Power Allure - Booking Confirmed!\n\nCongratulations ${bookingData.userName}!\n\nYour booking has been confirmed:\nModel: ${bookingData.modelName}\nEvent: ${bookingData.event}\nDate: ${bookingData.eventDate}\nTime: ${bookingData.eventTime}\n\n© ${new Date().getFullYear()} Power Allure`;

  try {
    await sendEmail(email, subject, html, text);
    log.info('Booking confirmed email sent', { email });
  } catch (error) {
    log.error('Failed to send booking confirmed email', { email, error: error.message });
  }
};

/**
 * Send booking cancelled email
 */
export const sendBookingCancelledEmail = async (email, bookingData) => {
  const subject = 'Booking Cancelled - Power Allure';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #e5e5e5; background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%); padding: 40px 20px; }
        .container { max-width: 600px; margin: 0 auto; background: linear-gradient(to bottom, #1f1f1f, #0f0f0f); border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(220, 184, 135, 0.15); border: 1px solid rgba(220, 184, 135, 0.2); }
        .header { background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%); padding: 50px 40px; text-align: center; border-bottom: 2px solid #dcb887; }
        .logo { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 700; background: linear-gradient(135deg, #f4e4c1 0%, #dcb887 50%, #c9a876 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 10px; }
        .subtitle { color: #9ca3af; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; }
        .content { padding: 40px; background: rgba(31, 31, 31, 0.5); }
        .greeting { font-size: 18px; color: #dcb887; margin-bottom: 20px; font-weight: 600; }
        .message { color: #d1d5db; font-size: 15px; margin-bottom: 20px; line-height: 1.8; }
        .status-badge { display: inline-block; background: rgba(239, 68, 68, 0.2); color: #f87171; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 600; border: 2px solid #f87171; }
        .details-box { background: linear-gradient(135deg, #2a2a2a, #1f1f1f); border: 2px solid #dcb887; border-radius: 12px; padding: 25px; margin: 25px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(220, 184, 135, 0.1); }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { color: #9ca3af; font-size: 14px; }
        .detail-value { color: #dcb887; font-weight: 600; font-size: 14px; }
        .footer { text-align: center; padding: 30px 40px; background: #0a0a0a; border-top: 1px solid rgba(220, 184, 135, 0.1); }
        .footer p { font-size: 12px; color: #6b7280; margin-bottom: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"> 
          <div class="logo">Power Allure</div>
          <div class="subtitle">Booking Cancelled</div>
        </div>
        <div class="content">
          <div class="greeting">Hello ${bookingData.userName},</div>
          <p class="message">Your booking request has been cancelled.</p>
          <div style="text-align: center; margin: 25px 0;">
            <span class="status-badge">✕ CANCELLED</span>
          </div>
          <div class="details-box">
            <div class="detail-row"><span class="detail-label">Model:</span><span class="detail-value">${bookingData.modelName}</span></div>
            <div class="detail-row"><span class="detail-label">Event:</span><span class="detail-value">${bookingData.event}</span></div>
            <div class="detail-row"><span class="detail-label">Date:</span><span class="detail-value">${new Date(bookingData.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
            <div class="detail-row"><span class="detail-label">Time:</span><span class="detail-value">${bookingData.eventTime}</span></div>
            ${bookingData.company ? `<div class="detail-row"><span class="detail-label">Company:</span><span class="detail-value">${bookingData.company}</span></div>` : ''}
          </div>
          <p class="message">If you have any questions or concerns, please contact our support team.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Power Allure. All Rights Reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `Power Allure - Booking Cancelled\n\nHello ${bookingData.userName},\n\nYour booking has been cancelled:\nModel: ${bookingData.modelName}\nEvent: ${bookingData.event}\nDate: ${bookingData.eventDate}\nTime: ${bookingData.eventTime}\n\n© ${new Date().getFullYear()} Power Allure`;

  try {
    await sendEmail(email, subject, html, text);
    log.info('Booking cancelled email sent', { email });
  } catch (error) {
    log.error('Failed to send booking cancelled email', { email, error: error.message });
  }
};
