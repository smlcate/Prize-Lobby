const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminChallengesController');
const authenticate = require('../middleware/authenticate');
const verifyAdmin = require('../middleware/verifyAdmin');

router.get('/', authenticate, verifyAdmin, controller.getAllChallenges);
router.post('/:id/complete', authenticate, verifyAdmin, controller.forceComplete);
router.post('/:id/resolve', authenticate, verifyAdmin, controller.resolveDispute);

module.exports = router;
