const db = require('../models/db');
// const verifyMatch = require('../services/matchVerifier'); // hypothetical service if needed later

// POST /api/match/:id/submit
exports.submitResult = async (req, res) => {
  const userId = req.user.id;
  const matchId = req.params.id;
  const { score, result, notes } = req.body;

  try {
    const match = await db('bracket_matches').where({ id: matchId }).first();
    if (!match) return res.status(404).json({ error: 'Match not found' });

    // Prevent submitting to finished match
    if (match.status === 'completed') {
      return res.status(400).json({ error: 'Match already completed' });
    }

    // Check if user is involved
    const isPlayer = [match.player1_id, match.player2_id].includes(userId);
    if (!isPlayer) return res.status(403).json({ error: 'Not authorized to submit result for this match' });

    // Save result as unverified
    await db('match_submissions').insert({
      match_id: matchId,
      submitted_by: userId,
      result,
      score,
      notes: notes || null,
      verified: false
    });

    res.status(200).json({ message: 'Match result submitted for review' });
  } catch (err) {
    console.error('❌ Failed to submit match result:', err);
    res.status(500).json({ error: 'Failed to submit match result' });
  }
};
