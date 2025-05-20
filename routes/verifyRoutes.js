const express = require('express');
const router = express.Router();
const controller = require('../controllers/verifyController');
const authenticate = require('../middleware/authenticate');
const verifyAdmin = require('../middleware/verifyAdmin');

router.get('/league/:summonerName', authenticate, controller.getLeagueAccount);
router.get('/dev/mock-lol-match/:challengeId', authenticate, verifyAdmin, controller.mockMatchVerification);

module.exports = router;
