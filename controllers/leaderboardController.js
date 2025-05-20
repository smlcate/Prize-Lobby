
const db = require('../models/db');

exports.getLeaderboard = async (req, res) => {
  try {
    const { game, platform, limit = 20 } = req.query;

    const query = db('leaderboard')
      .join('users', 'leaderboard.user_id', 'users.id')
      .select(
        'leaderboard.user_id',
        'users.username',
        'leaderboard.game',
        'leaderboard.platform',
        'leaderboard.total_wins',
        'leaderboard.total_matches',
        'leaderboard.total_prize',
        'leaderboard.total_xp'
      )
      .orderBy('leaderboard.total_prize', 'desc')
      .limit(limit);

    if (game) query.where('leaderboard.game', game);
    if (platform) query.where('leaderboard.platform', platform);

    const results = await query;

    res.json(results);
  } catch (err) {
    console.error('❌ Leaderboard fetch failed:', err);
    res.status(500).json({ error: 'Failed to load leaderboard' });
  }
};
