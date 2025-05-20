const express = require('express');
const router = express.Router();
const { mockResolveChallenge } = require('../controllers/mockVerifyController');

router.post('/:challengeId', mockResolveChallenge);

module.exports = router;
