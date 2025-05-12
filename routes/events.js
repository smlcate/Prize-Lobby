const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');
const verifyToken = require('../middleware/verifyToken');

// Public
router.get('/', eventsController.getAllEvents);
router.get('/:id', eventsController.getEventById);

// Protected
router.post('/create', verifyToken, eventsController.createEvent);
router.post('/join/:eventId', verifyToken, eventsController.joinEvent);
router.post('/start/:eventId', verifyToken, eventsController.startEvent);
router.post('/:eventId/complete', verifyToken, eventsController.completeEvent);

module.exports = router;
