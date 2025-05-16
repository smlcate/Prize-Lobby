// routes/gamertags.js
const express = require('express');
const router = express.Router();
const gamertagController = require('../controllers/gamertagController');
const authenticate = require('../middleware/authenticate');

const apexTracker = require('../controllers/apexTrackerController');
router.get('/validate/apex/:platform/:username', apexTracker.validateApexGamertag);


// POST /api/gamertags - Add a new gamertag
router.post('/', authenticate, gamertagController.addGamertag);

// POST /api/gamertags/validate - Validate gamertag against Tracker.gg
router.post('/validate', authenticate, gamertagController.validateGamertag);

// GET /api/gamertags - Get user's gamertags
router.get('/', authenticate, gamertagController.getUserGamertags);

// DELETE /api/gamertags/:id - Remove a gamertag
router.delete('/:id', authenticate, gamertagController.deleteGamertag);

module.exports = router;
