
const db = require('../models/db');

exports.getMyMatchHistory = async (req, res) => {
  try {
    const history = await db('match_history')
      .where({ user_id: req.user.id })
      .orderBy('played_at', 'desc')
      .limit(100);
    res.json(history);
  } catch (err) {
    console.error('❌ Failed to fetch match history:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
