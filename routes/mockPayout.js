const express = require('express');
const router = express.Router();
const { mockChallengePayout, mockEventPayout } = require('../controllers/mockPayoutController');

router.post('/payout/challenge/:id', mockChallengePayout);
router.post('/payout/event/:id', mockEventPayout);

module.exports = router;
