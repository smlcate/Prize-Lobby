const express = require('express');
const router = express.Router();

const authenticate = require('../middleware/authenticate');
const { challengeDisputeLimiter } = require('../middleware/rateLimitMiddleware');
const controller = require('../controllers/challengeDisputeController');

router.post('/:id/dispute', authenticate, challengeDisputeLimiter, controller.submitDispute);

module.exports = router;
