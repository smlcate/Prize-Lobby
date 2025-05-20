const db = require('../models/db');

exports.getAllChallenges = async (req, res) => {
  try {
    const challenges = await db('challenges').orderBy('created_at', 'desc');
    res.json(challenges);
  } catch (err) {
    console.error('Failed to fetch admin challenges:', err);
    res.status(500).json({ error: 'Failed to load challenges' });
  }
};

exports.forceComplete = async (req, res) => {
  const challengeId = req.params.id;

  try {
    const challenge = await db('challenges').where({ id: challengeId }).first();
    if (!challenge) return res.status(404).json({ error: 'Challenge not found' });

    await db('challenges').where({ id: challengeId }).update({ status: 'completed' });

    await db('challenge_results').insert({
      challenge_id: challengeId,
      reported_by: req.user.id,
      verified: true,
      auto_verified: false
    });

    res.json({ message: 'Challenge marked as completed' });
  } catch (err) {
    console.error('Force complete error:', err);
    res.status(500).json({ error: 'Failed to complete challenge' });
  }
};

exports.resolveDispute = async (req, res) => {
  const challengeId = req.params.id;
  const { winner_id } = req.body;

  try {
    const challenge = await db('challenges').where({ id: challengeId }).first();
    if (!challenge) return res.status(404).json({ error: 'Challenge not found' });

    await db('challenges').where({ id: challengeId }).update({
      status: 'completed',
      winner_id
    });

    await db('challenge_results').insert({
      challenge_id: challengeId,
      reported_by: req.user.id,
      winner_id,
      verified: true,
      auto_verified: false
    });

    res.json({ message: 'Dispute resolved with winner: ' + winner_id });
  } catch (err) {
    console.error('Resolve dispute error:', err);
    res.status(500).json({ error: 'Failed to resolve dispute' });
  }
};
