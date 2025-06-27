const express = require('express');
const router = express.Router();
const {
  register,
  login,
  updateUser,
  changePassword,
  savePreferences,
  savePrivacy,
  deleteAccount
} = require('../controllers/authController');

// Public
router.post('/register', register);
router.post('/login', login);

// Settings
router.put('/update/:id', updateUser);
router.post('/change-password', changePassword);
router.put('/preferences/:id', savePreferences);
router.put('/privacy/:id', savePrivacy);
router.delete('/delete/:id', deleteAccount);

module.exports = router;
