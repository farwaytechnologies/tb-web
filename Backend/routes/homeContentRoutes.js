const express = require('express');
const router = express.Router();
const {
  getHomeContent,
  updateHomeContent,
  deleteHomeContent
} = require('../controllers/homeContentController');

// GET - fetch current home content
router.get('/', getHomeContent);

// POST - create or update home content
router.post('/update', updateHomeContent);

// DELETE - remove home content
router.delete('/delete', deleteHomeContent);

module.exports = router;
