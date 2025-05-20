const express = require('express');
const router = express.Router();

const authenticate = require('../middleware/authenticate');
const { matchSubmitLimiter } = require('../middleware/rateLimitMiddleware');
const controller = require('../controllers/matchSubmitController');

router.post('/:id/submit', authenticate, matchSubmitLimiter, controller.submitResult);

module.exports = router;
