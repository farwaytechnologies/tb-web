const Razorpay = require('razorpay');
const crypto = require('crypto');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Invoice = require('../models/Invoice');

// Lazy init — ensures dotenv has loaded before reading keys
function getRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret || keyId.includes('XXXX')) {
    throw new Error('Razorpay keys not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Backend/.env');
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

// POST /api/payment/create-order
exports.createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) return res.status(400).json({ error: 'courseId is required.' });

    const course = await Course.findById(courseId).select('title price');
    if (!course) return res.status(404).json({ error: 'Course not found.' });

    const amount = Number(course.price);
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'This course is free — no payment needed.' });
    }

    let razorpay;
    try {
      razorpay = getRazorpay();
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: { courseId: String(courseId), courseTitle: course.title }
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      courseTitle: course.title,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    // Surface the actual Razorpay error message
    const msg = err?.error?.description || err?.message || 'Failed to create payment order.';
    console.error('Create order error:', err);
    res.status(500).json({ error: msg });
  }
};

// POST /api/payment/verify
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id, razorpay_payment_id, razorpay_signature,
      userId, courseId, fullName, email, phone, message
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment verification fields.' });
    }

    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSig !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed. Invalid signature.' });
    }

    const course = await Course.findById(courseId).select('title instructor level price');
    if (!course) return res.status(404).json({ error: 'Course not found.' });

    let enrollment;
    try {
      enrollment = await Enrollment.create({ userId, courseId, fullName, email, phone, message });
    } catch (err) {
      if (err.code === 11000) {
        enrollment = await Enrollment.findOne({ userId, courseId });
      } else throw err;
    }

    const existing = await Invoice.findOne({ enrollmentId: enrollment._id });
    if (existing) return res.json({ success: true, enrollment, invoice: existing });

    const invoice = await Invoice.create({
      userId,
      enrollmentId: enrollment._id,
      courseId,
      studentName: fullName,
      studentEmail: email,
      studentPhone: phone,
      courseTitle: course.title,
      courseInstructor: course.instructor || '',
      courseLevel: course.level || '',
      amount: Number(course.price),
      status: 'Paid',
      paymentRef: razorpay_payment_id
    });

    res.status(201).json({ success: true, enrollment, invoice });
  } catch (err) {
    const msg = err?.error?.description || err?.message || 'Payment verification failed.';
    console.error('Verify payment error:', err);
    res.status(500).json({ error: msg });
  }
};
