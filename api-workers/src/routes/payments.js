import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { supabase } from '../config/supabase.js';
import { AppError } from '../middleware/errorHandler.js';
import axios from 'axios';

const router = express.Router();

// Create Razorpay order
router.post(
  '/create-order',
  [
    body('amount').isNumeric().withMessage('Amount is required'),
    body('application_id').isUUID().withMessage('Application ID is required'),
    validate
  ],
  async (req, res, next) => {
    try {
      const { amount, application_id, purpose = 'counseling_fee' } = req.body;

      // Create Razorpay order
      const response = await axios.post(
        'https://api.razorpay.com/v1/orders',
        {
          amount: amount * 100, // Convert to paise
          currency: 'INR',
          receipt: `receipt_${application_id}`,
          notes: {
            application_id,
            purpose
          }
        },
        {
          auth: {
            username: process.env.RAZORPAY_KEY_ID,
            password: process.env.RAZORPAY_KEY_SECRET
          }
        }
      );

      // Store payment record
      const { data: payment, error } = await supabase
        .from('payments')
        .insert([{
          application_id,
          order_id: response.data.id,
          amount,
          currency: 'INR',
          status: 'created',
          purpose
        }])
        .select()
        .single();

      if (error) throw error;

      res.json({
        order: response.data,
        payment_id: payment.id,
        key: process.env.RAZORPAY_KEY_ID
      });
    } catch (error) {
      next(error);
    }
  }
);

// Verify payment
router.post(
  '/verify',
  [
    body('razorpay_order_id').notEmpty().withMessage('Order ID is required'),
    body('razorpay_payment_id').notEmpty().withMessage('Payment ID is required'),
    body('razorpay_signature').notEmpty().withMessage('Signature is required'),
    validate
  ],
  async (req, res, next) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      // Verify signature
      const crypto = await import('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        throw new AppError('Invalid payment signature', 400);
      }

      // Update payment status
      const { data: payment, error } = await supabase
        .from('payments')
        .update({
          payment_id: razorpay_payment_id,
          signature: razorpay_signature,
          status: 'completed',
          paid_at: new Date().toISOString()
        })
        .eq('order_id', razorpay_order_id)
        .select()
        .single();

      if (error) throw error;

      res.json({
        success: true,
        payment
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
