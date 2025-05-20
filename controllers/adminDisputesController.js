const db = require('../models/db');

exports.getAllDisputes = async (req, res) => {
  try {
    const disputes = await db('disputes')
      .leftJoin('users', 'disputes.user_id', 'users.id')
      .leftJoin('challenges', 'disputes.challenge_id', 'challenges.id')
      .select(
        'disputes.id',
        'disputes.reason',
        'disputes.status',
        'disputes.admin_comment',
        db.raw("COALESCE(users.username, 'Unknown') as submitted_by"),
        db.raw("COALESCE(challenges.title, 'Untitled') as challenge_title")
      )
      .orderBy('disputes.created_at', 'desc');

    res.json(disputes);
  } catch (err) {
    console.error('Error loading disputes:', err);
    res.status(500).json({ error: 'Failed to load disputes' });
  }
};
