const express = require('express');
const router = express.Router();
const knex = require('../models/db');
const { parseChallengeResult } = require('../utils/resultUtils');

router.get('/recent-completed', async (req, res) => {
  try {
    const userId = req.user.id;

    const challenges = await knex('challenges')
      .whereIn('status', ['completed', 'draw'])
      .andWhere('id', 'in', function () {
        this.select('challenge_id').from('challenges_participants').where('user_id', userId);
      })
      .orderBy('updated_at', 'desc');

    const response = [];

    for (const challenge of challenges) {
      const participants = await knex('challenges_participants')
        .join('users', 'users.id', 'challenges_participants.user_id')
        .where('challenge_id', challenge.id)
        .select('users.username', 'users.id');

      const opponent = participants.find(p => p.id !== userId);
      const { user_score, opponent_score } = parseChallengeResult(challenge.result, userId, opponent.id);
        const scores = [result.p1Score || 0, result.p2Score || 0];
        const userWon = challenge.winner_id === userId;

        if (userWon) {
          user_score = Math.max(...scores);
          opponent_score = Math.min(...scores);
        } else {
          user_score = Math.min(...scores);
          opponent_score = Math.max(...scores);
        }
      } catch (_) {}

      const existingDispute = await knex('disputes')
        .where({ challenge_id: challenge.id, user_id: userId })
        .first();

      response.push({
        id: challenge.id,
        challenge_title: challenge.title,
        opponent_name: opponent?.username || 'Unknown',
        status: challenge.status,
        user_score,
        opponent_score,
        alreadyDisputed: !!existingDispute,
        canDispute: ['completed', 'draw'].includes(challenge.status)
      });
    }

    res.json(response);
  } catch (err) {
    console.error('Error fetching recent completed challenges:', err);
    res.status(500).json({ error: 'Failed to fetch match history' });
  }
});

module.exports = router;
