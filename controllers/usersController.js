const db = require('../models/db');

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await db('users')
      .select('id', 'email', 'username')
      .where({ id: userId })
      .first();

    const wallet = await db('wallets')
      .select('balance')
      .where({ user_id: userId })
      .first();

    const gamertags = await db('gamertags')
      .select('id', 'platform', 'gamertag')
      .where({ user_id: userId });

    const recentMatches = await db('challenges')
      .select('id', 'title', 'game', 'status', 'created_at')
      .where(function () {
        this.where('creator_id', userId).orWhereIn('id', function () {
          this.select('challenge_id')
            .from('challenges_participants')
            .where('user_id', userId);
        });
      })
      .orderBy('created_at', 'desc')
      .limit(5);

    const notifications = await db('notifications')
      .select('message', 'created_at')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc')
      .limit(5);

    res.json({
      wallet_balance: wallet?.balance || 0,
      gamertags,
      notifications,
      id: user.id,
      email: user.email,
      username: user.username,
      wallet: wallet?.balance || 0,
      gamertags,
      recentMatches,
      notifications,
    });
  } catch (err) {
    console.error('❌ Error in /api/users/me:', err);
    res.status(500).json({ error: 'Failed to load profile' });
  }
};
