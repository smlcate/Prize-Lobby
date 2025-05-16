const express = require('express');
const router = express.Router();
const knex = require('../models/db');

// POST /api/challenges/:id/dispute
router.post('/:id/dispute', async (req, res) => {
  try {
    const challengeId = req.params.id;
    const userId = req.user.id;
    const { reason } = req.body;

    if (!reason || reason.trim().length < 5) {
      return res.status(400).json({ error: 'Reason is required and must be at least 5 characters long.' });
    }

    const challenge = await knex('challenges').where({ id: challengeId }).first();
    if (!challenge) return res.status(404).json({ error: 'Challenge not found.' });

    // Only allow disputes if match is complete or a draw
    if (!['completed', 'draw'].includes(challenge.status)) {
      return res.status(400).json({ error: 'Challenge must be completed or drawn to file a dispute.' });
    }

    // Check if this user already filed a dispute
    const existing = await knex('disputes')
      .where({ challenge_id: challengeId, user_id: userId })
      .first();

    if (existing) {
      return res.status(400).json({ error: 'You have already filed a dispute for this challenge.' });
    }

    const [dispute] = await knex('disputes')
      .insert({
        challenge_id: challengeId,
        user_id: userId,
        reason
      })
      .returning('*');

    res.status(201).json({ message: 'Dispute submitted', dispute });
  } catch (err) {
    console.error('Dispute creation failed:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
