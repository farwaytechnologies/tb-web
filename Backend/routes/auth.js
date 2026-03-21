const express = require('express');
const router = express.Router();
const {
  register, login, updateUser, updateSettings,
  changePassword, deleteAccount, getAllUsers,
  updateBankDetails, getBankDetails,
  banUser, unbanUser,
} = require('../controllers/authController');
const { authLimiter } = require('../middleware/security');

// Public (rate limited)
router.post('/register', authLimiter, register);
router.post('/login',    authLimiter, login);

// Profile
router.put('/update/:id', updateUser);
router.put('/settings/:id', updateSettings);
router.post('/change-password', changePassword);
router.delete('/delete/:id', deleteAccount);

// Admin
router.get('/users', getAllUsers);

// Bank details (tutors)
router.get('/bank/:id', getBankDetails);
router.put('/bank/:id', updateBankDetails);

// Ban / Unban
router.put('/ban/:id', banUser);
router.put('/unban/:id', unbanUser);

module.exports = router;
