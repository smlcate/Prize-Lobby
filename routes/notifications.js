const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { getNotifications, markAsRead } = require('../controllers/notificationsController');

router.get('/', authenticate, getNotifications);
router.post('/:id/read', authenticate, markAsRead);

module.exports = router;
