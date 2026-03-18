const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController');

router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);

// Quick key health-check — GET /api/payment/ping
router.get('/ping', (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID || '';
  const secret = process.env.RAZORPAY_KEY_SECRET || '';
  res.json({
    keyConfigured: keyId.startsWith('rzp_') && !keyId.includes('XXXX'),
    keyId: keyId ? `${keyId.slice(0, 12)}...` : 'NOT SET',
    secretSet: secret.length > 10 && !secret.includes('XXXX'),
    mode: keyId.startsWith('rzp_live_') ? 'LIVE' : 'TEST'
  });
});

module.exports = router;
