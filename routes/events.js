const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');
const authenticate = require('../middleware/authenticate');

// Create a new event
router.post('/', authenticate, eventsController.createEvent);

// Get all events
router.get('/', eventsController.getAllEvents);

// Get event by ID
router.get('/:id', eventsController.getEventById);

module.exports = router;
