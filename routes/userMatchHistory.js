
const express = require('express');
const router = express.Router();
const controller = require('../controllers/userMatchHistoryController');
const authenticate = require('../middleware/authenticate');

router.get('/me/match-history', authenticate, controller.getMyMatchHistory);

module.exports = router;
