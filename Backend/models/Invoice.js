const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  enrollmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  studentPhone: { type: String, default: '' },
  courseTitle: { type: String, required: true },
  courseInstructor: { type: String, default: '' },
  courseLevel: { type: String, default: '' },
  amount: { type: Number, required: true, default: 0 },
  status: {
    type: String,
    enum: ['Paid', 'Free', 'Pending'],
    default: 'Pending'
  },
  paymentRef: { type: String, default: '' },
  issuedAt: { type: Date, default: Date.now }
});

// Auto-generate invoice number before save
invoiceSchema.pre('validate', async function (next) {
  if (!this.invoiceNumber) {
    const count = await mongoose.model('Invoice').countDocuments();
    const pad = String(count + 1).padStart(5, '0');
    this.invoiceNumber = `INV-${new Date().getFullYear()}-${pad}`;
  }
  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
