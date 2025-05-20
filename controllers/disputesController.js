const db = require('../models/db');

exports.createDispute = async (req, res) => {
  try {
    const challengeId = req.params.id;
    const userId = req.user.id;
    const { reason } = req.body;

    if (!reason || reason.trim().length < 5) {
      return res.status(400).json({ error: 'Reason is required and must be at least 5 characters long.' });
    }

    const challenge = await db('challenges').where({ id: challengeId }).first();
    if (!challenge) return res.status(404).json({ error: 'Challenge not found.' });

    const validStatuses = ['completed', 'draw', 'disputed'];
    if (!validStatuses.includes(challenge.status)) {
      return res.status(400).json({ error: 'Challenge must be completed to file a dispute.' });
    }

    const existing = await db('disputes')
      .where({ match_id: challengeId, user_id: userId })
      .first();

    if (existing) {
      return res.status(400).json({ error: 'You have already filed a dispute for this challenge.' });
    }

    const [dispute] = await db('disputes')
      .insert({
        match_id: challengeId,
        user_id: userId,
        reason,
        status: 'pending',
        created_at: new Date()
      })
      .returning('*');

    res.status(201).json({ dispute });
  } catch (err) {
    console.error('❌ Failed to create dispute:', err);
    res.status(500).json({ error: 'Failed to create dispute' });
  }
};
