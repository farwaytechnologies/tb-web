const express = require('express');
const router = express.Router();
const { generateInvoice, getAllInvoices, getUserInvoices, getInvoiceById } = require('../controllers/invoiceController');

router.post('/generate', generateInvoice);   // paid courses: enroll + invoice after payment
router.get('/', getAllInvoices);
router.get('/user/:userId', getUserInvoices);
router.get('/:id', getInvoiceById);

module.exports = router;
