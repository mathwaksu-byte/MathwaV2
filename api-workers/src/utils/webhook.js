import axios from 'axios';
import { logger } from './logger.js';

export const sendToWebhook = async (data) => {
  try {
    const webhookUrl = process.env.CRM_WEBHOOK_URL;
    
    if (!webhookUrl) {
      logger.warn('CRM webhook URL not configured');
      return;
    }

    const response = await axios.post(webhookUrl, data, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 5000 // 5 second timeout
    });

    logger.info(`Webhook sent successfully: ${response.status}`);
    return response.data;
  } catch (error) {
    logger.error(`Webhook error: ${error.message}`);
    throw error;
  }
};
