const db = require('../models/db');

exports.getProfile = async (req, res) => {
  const user_id = req.user.id;

  try {
    const [user, wallet, events, challenges, notifications, myGamertags] = await Promise.all([
      db('users').where({ id: user_id }).first(),
      db('wallets').where({ user_id }).first(),
      db('events').where({ creator_id: user_id }).orderBy('created_at', 'desc').limit(5),
      db('challenges')
        .join('challenges_participants', 'challenges.id', '=', 'challenges_participants.challenge_id')
        .where('challenges_participants.user_id', user_id)
        .orderBy('challenges.created_at', 'desc')
        .limit(5)
        .select('challenges.*'),
      db('notifications').where({ user_id }).orderBy('created_at', 'desc').limit(5),
      db('gamertags').where({ user_id })
    ]);

    const challengeIds = challenges.map(c => c.id);
    const opponentRows = await db('challenges_participants')
      .whereIn('challenge_id', challengeIds)
      .andWhereNot('user_id', user_id)
      .select('user_id');
    const opponentIds = opponentRows.map(row => row.user_id);

    let opponentGamertags = [];
    if (opponentIds.length > 0) {
      opponentGamertags = await db('gamertags')
        .whereIn('user_id', opponentIds)
        .select('user_id', 'platform', 'gamertag');
    }

    const recentChallengeMatches = await db('challenges_participants')
      .whereIn('challenge_id', challengeIds)
      .andWhere('user_id', user_id)
      .select('*');

    const recentMatches = recentChallengeMatches.map(match => {
      const opponent = opponentGamertags.find(tag => tag.user_id !== user_id);
      return {
        id: match.challenge_id,
        type: 'challenge',
        opponent_tag: opponent ? opponent.gamertag : 'Unknown',
        result: match.is_winner ? 'win' : 'loss',
        score: match.score
      };
    });

    res.json({ user, wallet, events, challenges, notifications, opponentGamertags, myGamertags, recent_matches: recentMatches });
  } catch (err) {
    console.error('[GET /api/profile] Error:', err);
    res.status(500).json({ error: 'Failed to load profile' });
  }
};
