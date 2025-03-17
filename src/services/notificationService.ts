import { Notification } from '../context/NotificationContext';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid
sgMail.setApiKey(process.env.REACT_APP_SENDGRID_API_KEY || '');

export const sendEmail = async (recipient: string, subject: string, message: string): Promise<boolean> => {
  try {
    const msg = {
      to: recipient,
      from: process.env.REACT_APP_SENDGRID_FROM_EMAIL || '',
      subject: subject,
      text: message,
      html: message.replace(/\n/g, '<br>'),
    };

    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

// Placeholder for SMS functionality - to be implemented when Twilio API is ready
export const sendSMS = async (recipient: string, message: string): Promise<boolean> => {
  try {
    // TODO: Implement actual SMS sending when Twilio API is ready
    console.log('SMS would be sent to:', recipient);
    console.log('Message:', message);
    return true;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return false;
  }
};

export const processNotification = async (notification: Notification): Promise<boolean> => {
  try {
    let success = false;
    
    if (notification.type === 'email') {
      success = await sendEmail(notification.recipient, notification.title, notification.message);
    } else if (notification.type === 'sms') {
      success = await sendSMS(notification.recipient, notification.message);
    }

    return success;
  } catch (error) {
    console.error('Failed to process notification:', error);
    return false;
  }
}; 