const express = require('express');
const router = express.Router();
const { register, login, updateUser } = require('../controllers/authController');

// User Registration
router.post('/register', register);

// User Login
router.post('/login', login);

// 🆕 Update User Profile
router.put('/update/:id', updateUser);

module.exports = router;
