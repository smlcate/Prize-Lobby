const db = require('../models/db');

exports.mockResolveChallenge = async (req, res) => {
  const { challengeId } = req.params;
  const winnerId = req.body.winner_id;
  const score = req.body.score || 1000;

  try {
    await db('challenges').where({ id: challengeId }).update({ status: 'completed', winner_id: winnerId });
    await db('wallets').where({ user_id: winnerId }).increment('balance', 100);
    await db('transactions').insert({ user_id: winnerId, amount: 100, type: 'winnings' });

    res.json({ success: true, message: `Challenge ${challengeId} resolved, winner ID ${winnerId}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to simulate result' });
  }
};
