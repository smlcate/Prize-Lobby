const express = require('express');
const router = express.Router();

const authenticate = require('../middleware/authenticate');
const { challengeJoinLimiter } = require('../middleware/rateLimitMiddleware');
const controller = require('../controllers/challengesController');

// ✅ Route definition using router
router.post('/:id/join', authenticate, challengeJoinLimiter, controller.joinChallenge);

module.exports = router;
