const express = require('express');
const router = express.Router();
const {
  register,
  login,
  updateUser,
  updateSettings,
  changePassword,
  deleteAccount,
  getAllUsers
} = require('../controllers/authController');

// Public
router.post('/register', register);
router.post('/login', login);

// Profile
router.put('/update/:id', updateUser);
router.put('/settings/:id', updateSettings);
router.post('/change-password', changePassword);
router.delete('/delete/:id', deleteAccount);

// Admin
router.get('/users', getAllUsers);

module.exports = router;
