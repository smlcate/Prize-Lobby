const express = require('express');
const router = express.Router();
const knex = require('../models/db');
const { parseChallengeResult } = require('../utils/resultUtils');

// GET /api/challenges/:id/result
router.get('/:id/result', async (req, res) => {
  try {
    const userId = req.user.id;
    const challengeId = req.params.id;

    const challenge = await knex('challenges').where({ id: challengeId }).first();
    if (!challenge) return res.status(404).json({ error: 'Challenge not found.' });

    const participants = await knex('challenges_participants')
      .join('users', 'users.id', 'challenges_participants.user_id')
      .where('challenges_participants.challenge_id', challengeId)
      .select('users.id', 'users.username', 'challenges_participants.gamertag');

    const current = participants.find(p => p.id === userId);
    const opponent = participants.find(p => p.id !== userId);

    if (!current || !opponent) return res.status(403).json({ error: 'Not a participant.' });

    const { user_score, opponent_score } = parseChallengeResult(challenge.result, userId, opponent.id);
      const result = JSON.parse(challenge.result || '{}');
      if (challenge.winner_id === userId) {
        userScore = result.p1Score > result.p2Score ? result.p1Score : result.p2Score;
        opponentScore = result.p1Score > result.p2Score ? result.p2Score : result.p1Score;
      } else {
        opponentScore = result.p1Score > result.p2Score ? result.p1Score : result.p2Score;
        userScore = result.p1Score > result.p2Score ? result.p2Score : result.p1Score;
      }
    } catch (_) {}

    const alreadyDisputed = await knex('disputes')
      .where({ challenge_id: challengeId, user_id: userId })
      .first();

    res.json({
      status: challenge.status,
      userScore,
      opponentScore,
      opponentName: opponent.username,
      alreadyDisputed: !!alreadyDisputed
    });
  } catch (err) {
    console.error('Error in result route:', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

module.exports = router;
