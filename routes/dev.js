const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const verifyAdmin = require('../middleware/verifyAdmin');
const { seedTestChallenge } = require('../controllers/devController');

router.post('/seed-test-challenge', authenticate, verifyAdmin, seedTestChallenge);

module.exports = router;
