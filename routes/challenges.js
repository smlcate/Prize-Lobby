
const express = require('express');
const router = express.Router();
const db = require('../models/db');
const requireAuth = require('../middleware/authenticate');
const { joinChallenge } = require('../controllers/challenges');

// GET /api/challenges - List all challenges (visible to users)
router.get('/', async (req, res) => {
  try {
    const challenges = await db('challenges')
      .select('*')
      .where('status', 'open')
      .orderBy('created_at', 'desc');
    res.json(challenges);
  } catch (err) {
    console.error('Error fetching challenges:', err);
    res.status(500).json({ error: 'Failed to fetch challenges' });
  }
});

// GET /api/challenges/:id - Get one challenge by ID
router.get('/:id', async (req, res) => {
  try {
    const challenge = await db('challenges')
      .where({ id: req.params.id })
      .first();
    if (!challenge) return res.status(404).json({ error: 'Challenge not found' });
    res.json(challenge);
  } catch (err) {
    console.error('Error fetching challenge:', err);
    res.status(500).json({ error: 'Failed to fetch challenge' });
  }
});

// POST /api/challenges - Create a challenge
router.post('/', requireAuth, async (req, res) => {
  const { title, game, platform, entry_fee, prize, type, format } = req.body;
  try {
    const [id] = await db('challenges').insert({
      creator_id: req.user.id,
      title,
      game,
      platform,
      entry_fee,
      prize,
      type,
      format,
      status: 'open'
    }).returning('id');
    res.status(201).json({ id });
  } catch (err) {
    console.error('Error creating challenge:', err);
    res.status(500).json({ error: 'Failed to create challenge' });
  }
});

// POST /api/challenges/:id/join - Refactored to use controller logic
router.post('/:id/join', requireAuth, joinChallenge);

module.exports = router;
