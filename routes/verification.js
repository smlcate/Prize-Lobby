const express = require('express');
const router = express.Router();
const { verifyChallenge } = require('../controllers/verificationController');

router.get('/:id/verify', verifyChallenge);

module.exports = router;
