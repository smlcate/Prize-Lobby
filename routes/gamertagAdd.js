const express = require('express');
const router = express.Router();

const authenticate = require('../middleware/authenticate');
const { gamertagAddLimiter } = require('../middleware/rateLimitMiddleware');
const controller = require('../controllers/gamertagController');

router.post('/', authenticate, gamertagAddLimiter, controller.addGamertag);

module.exports = router;
