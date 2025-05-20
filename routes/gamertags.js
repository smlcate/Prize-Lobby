const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const gamertagController = require('../controllers/gamertagController');

// GET all gamertags for authenticated user
router.get('/', authenticate, gamertagController.getUserGamertags);

// POST a new gamertag
router.post('/', authenticate, gamertagController.addGamertag);

// PUT update an existing gamertag by ID
router.put('/:id', authenticate, gamertagController.updateGamertag);

// DELETE a gamertag by ID
router.delete('/:id', authenticate, gamertagController.deleteGamertag);

// DELETE by platform (alternative delete method)
router.delete('/platform/:platform', authenticate, gamertagController.deleteGamertag);

// POST validate gamertag
router.post('/validate', authenticate, gamertagController.validateGamertag);

module.exports = router;
