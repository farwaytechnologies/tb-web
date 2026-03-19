const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.get('/', notificationController.getAllNotifications);
router.get('/stats', notificationController.getReadStats);
router.post('/', notificationController.createNotification);
router.delete('/:id', notificationController.deleteNotification);
router.put('/mark-read', notificationController.markAllAsRead);
router.patch('/:id/read', notificationController.markOneAsRead);

module.exports = router;
