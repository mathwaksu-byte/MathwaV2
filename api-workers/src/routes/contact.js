import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { supabase } from '../config/supabase.js';
import { sendToWebhook } from '../utils/webhook.js';

const router = express.Router();

// Submit contact form
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
    validate
  ],
  async (req, res, next) => {
    try {
      const { data: contact, error } = await supabase
        .from('contact_submissions')
        .insert([{
          ...req.body,
          status: 'new'
        }])
        .select()
        .single();

      if (error) throw error;

      // Send to webhook (non-blocking)
      if (process.env.CRM_WEBHOOK_URL) {
        sendToWebhook(contact).catch(err => 
          console.error('Webhook error:', err)
        );
      }

      res.status(201).json({
        message: 'Contact form submitted successfully',
        contact
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
