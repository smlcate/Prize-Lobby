const db = require('../models/db');

// ✅ POST /api/challenge/disputes/:id
exports.submitDispute = async (req, res) => {
  const userId = req.user.id;
  const challengeId = req.params.id;
  const { reason } = req.body;

  try {
    // Check if challenge exists and is completed
    const challenge = await db('challenges').where({ id: challengeId }).first();
    if (!challenge) return res.status(404).json({ error: 'Challenge not found' });
    if (challenge.status !== 'completed') {
      return res.status(400).json({ error: 'Disputes can only be submitted for completed challenges' });
    }

    // Check for existing dispute by this user
    const existingDispute = await db('disputes')
      .where({ challenge_id: challengeId, submitted_by: userId })
      .first();

    if (existingDispute) {
      return res.status(400).json({ error: 'You have already submitted a dispute for this challenge' });
    }

    if (!reason || reason.trim() === '') {
      return res.status(400).json({ error: 'A reason for the dispute is required' });
    }

    // Insert the dispute
    await db('disputes').insert({
      challenge_id: challengeId,
      submitted_by: userId,
      reason: reason.trim(),
      status: 'pending'
    });

    res.status(201).json({ message: 'Dispute submitted successfully' });
  } catch (err) {
    console.error('Error submitting dispute:', err);
    res.status(500).json({ error: 'Failed to submit dispute' });
  }
};