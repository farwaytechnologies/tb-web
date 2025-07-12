const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.get('/', notificationController.getAllNotifications);
router.post('/', notificationController.createNotification);
router.delete('/:id', notificationController.deleteNotification);
router.put('/mark-read', notificationController.markAllAsRead);

module.exports = router;
