const Invoice = require('../models/Invoice');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// Generate invoice after payment (paid courses only)
exports.generateInvoice = async (req, res) => {
  try {
    const { userId, courseId, fullName, email, phone, message, paymentRef } = req.body;

    if (!userId || !courseId || !fullName || !email || !phone) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const course = await Course.findById(courseId).select('title instructor level price');
    if (!course) return res.status(404).json({ error: 'Course not found.' });

    const amount = Number(course.price) || 0;
    if (amount === 0) {
      return res.status(400).json({ error: 'This course is free. No payment required.' });
    }

    // Create enrollment
    let enrollment;
    try {
      enrollment = await Enrollment.create({ userId, courseId, fullName, email, phone, message });
    } catch (err) {
      if (err.code === 11000) {
        // Already enrolled — still generate invoice if missing
        enrollment = await Enrollment.findOne({ userId, courseId });
      } else throw err;
    }

    // Check if invoice already exists for this enrollment
    const existing = await Invoice.findOne({ enrollmentId: enrollment._id });
    if (existing) return res.json({ enrollment, invoice: existing });

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
      amount,
      status: 'Paid',
      paymentRef: paymentRef || ''
    });

    res.status(201).json({ enrollment, invoice });
  } catch (err) {
    console.error('Generate invoice error:', err);
    res.status(500).json({ error: 'Failed to generate invoice.' });
  }
};

// Get all invoices (Admin)
exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ issuedAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch invoices.' });
  }
};

// Get invoices for a specific user
exports.getUserInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.params.userId })
      .sort({ issuedAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user invoices.' });
  }
};

// Get single invoice by ID
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found.' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch invoice.' });
  }
};
