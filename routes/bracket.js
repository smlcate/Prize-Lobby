// File: routes/bracket.js
const express = require('express');
const router = express.Router();
const db = require('../models/db');
const authenticate = require('../middleware/authenticate');

// GET /api/bracket?event_id=123
router.get('/', authenticate, async (req, res) => {
  const { event_id } = req.query;

  if (!event_id) {
    return res.status(400).json({ error: 'Missing event_id' });
  }

  try {
    const matches = await db('bracket_matches')
      .where({ event_id })
      .orderBy(['round_number', 'match_number']);

    const players = await db('event_participants')
      .where({ event_id });

    const participantsById = {};
    players.forEach(p => {
      participantsById[p.user_id] = p;
    });

    const bracket = matches.map(match => ({
      id: match.id,
      round: match.round_number,
      match: match.match_number,
      player1: participantsById[match.player1_id],
      player2: participantsById[match.player2_id],
      score1: match.score1,
      score2: match.score2,
      winner_id: match.winner_id,
      status: match.status,
    }));

    res.json({ bracket });
  } catch (err) {
    console.error('❌ Failed to load bracket:', err);
    res.status(500).json({ error: 'Failed to load bracket' });
  }
});

module.exports = router;
