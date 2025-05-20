const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminEventsController');
const authenticate = require('../middleware/authenticate');
const verifyAdmin = require('../middleware/verifyAdmin');

router.get('/', authenticate, verifyAdmin, controller.getAllEvents);
router.post('/:id/start', authenticate, verifyAdmin, controller.forceStart);

module.exports = router;
