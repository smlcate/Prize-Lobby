// File: controllers/matchController.js

const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { verifyApexMatch, verifyRocketLeagueMatch } = require('../services/trackerService');
const authenticate = require('../middleware/authenticate');

router.post('/:id/verify', authenticate, async (req, res) => {
  const matchId = req.params.id;

  try {
    const match = await db('bracket_matches').where({ id: matchId }).first();
    if (!match) return res.status(404).json({ error: 'Match not found' });

    const user = req.user;
    const userGamertag = await db('gamertags')
      .where({ user_id: user.id, game: match.game })
      .first();

    if (!userGamertag) return res.status(400).json({ error: 'Gamertag not set for this game' });

    let result = null;

    if (match.game === 'apex') {
      result = await verifyApexMatch(userGamertag.gamertag, userGamertag.platform);
    } else if (match.game === 'rocketleague') {
      result = await verifyRocketLeagueMatch(userGamertag.gamertag, userGamertag.platform);
    }

    if (!result || !result.verified) {
      return res.status(400).json({ error: 'Match could not be verified' });
    }

    // Example: record result (this depends on your schema)
    await db('bracket_matches')
      .where({ id: matchId })
      .update({
        verified: true,
        result_json: JSON.stringify(result)
      });

    return res.json({ success: true, result });
  } catch (err) {
    console.error('[MatchController] Verification error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
