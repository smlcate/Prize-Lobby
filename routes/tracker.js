const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { verifyRocketLeagueMatch } = require('../controllers/trackerController');

router.get('/rocket-league/match/:eventId', authenticate, verifyRocketLeagueMatch);

module.exports = router;
