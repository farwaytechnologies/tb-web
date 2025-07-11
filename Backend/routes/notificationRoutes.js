const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// GET all notifications
router.get('/', notificationController.getAllNotifications);

// POST a new notification
router.post('/', notificationController.createNotification);

// DELETE a notification
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
