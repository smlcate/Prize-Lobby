const db = require('../models/db');
const { parseChallengeResult } = require('../utils/resultUtils');

exports.getRecentCompleted = async (req, res) => {
  try {
    const userId = req.user.id;
    const challenges = await db('challenges')
      .whereIn('status', ['completed', 'draw'])
      .andWhere('id', 'in', function () {
        this.select('challenge_id').from('challenges_participants').where('user_id', userId);
      })
      .orderBy('updated_at', 'desc');

    const response = [];

    for (const challenge of challenges) {
      const participants = await db('challenges_participants')
        .join('users', 'users.id', 'challenges_participants.user_id')
        .where('challenge_id', challenge.id)
        .select('users.username', 'users.id');

      const opponent = participants.find(p => p.id !== userId);
      const { user_score, opponent_score } = parseChallengeResult(challenge.result, userId, opponent.id);

      const existingDispute = await db('disputes')
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
};
