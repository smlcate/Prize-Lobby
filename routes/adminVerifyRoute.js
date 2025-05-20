const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { triggerManualVerification } = require('../controllers/adminVerificationController');

router.post('/trigger-verification', authenticate, triggerManualVerification);

module.exports = router;
