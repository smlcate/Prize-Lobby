const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { withdrawLimiter } = require('../middleware/rateLimitMiddleware');
const controller = require('../controllers/withdrawalsController');

router.get('/', authenticate, controller.getWithdrawals);
router.post('/withdraw', authenticate, withdrawLimiter, controller.requestWithdrawal);

module.exports = router;