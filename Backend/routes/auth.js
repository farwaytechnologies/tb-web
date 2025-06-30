const express = require('express');
const router = express.Router();
const {
  register,
  login,
  updateUser,
  changePassword,
  deleteAccount,
  getAllUsers
} = require('../controllers/authController');

// Public
router.post('/register', register);
router.post('/login', login);

// Settings
router.put('/update/:id', updateUser);
router.post('/change-password', changePassword);
router.delete('/delete/:id', deleteAccount);

// Admin
router.get('/users', getAllUsers); // Only accessible by admin (add middleware if needed)

module.exports = router;
