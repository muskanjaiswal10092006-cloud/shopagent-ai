import express from 'express';
import {
  getRazorpayConfig,
  createRazorpayOrder,
  verifyRazorpaySignature,
} from '../services/razorpayService';

const router = express.Router();

// GET /api/razorpay/config
router.get('/config', (req, res) => {
  try {
    const config = getRazorpayConfig();
    return res.json(config);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/razorpay/create-order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, receipt, notes } = req.body;
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Valid positive amount in INR is required' });
    }

    const order = await createRazorpayOrder({
      amount,
      receipt,
      notes,
    });

    return res.json(order);
  } catch (error: any) {
    console.error('Razorpay order creation failed:', error.message);
    return res.status(400).json({
      success: false,
      error: error.message || 'Failed to create Razorpay order',
    });
  }
});

// POST /api/razorpay/verify
router.post('/verify', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const verification = verifyRazorpaySignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (verification.isValid) {
      return res.json({
        success: true,
        verified: true,
        message: verification.message,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      });
    } else {
      return res.status(400).json({
        success: false,
        verified: false,
        message: verification.message,
      });
    }
  } catch (error: any) {
    console.error('Payment signature verification error:', error);
    return res.status(500).json({
      error: 'Payment verification failed',
      details: error.message,
    });
  }
});

export default router;
