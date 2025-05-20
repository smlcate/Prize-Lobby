// controllers/verifyMatchController.js
const db = require('../models/db');
const { distributeChallengePrizeWithTeams } = require('../utils/payout_with_teams');

module.exports = {
  async submitResult(req, res) {
    try {
      const { challenge_id, winner_id } = req.body;
      const user_id = req.user.id;

      const challenge = await db('challenges').where({ id: challenge_id }).first();
      if (!challenge) return res.status(404).json({ error: 'Challenge not found' });

      const participants = await db('challenge_participants').where({ challenge_id });
      const isParticipant = participants.some(p => p.user_id === user_id);
      if (!isParticipant) return res.status(403).json({ error: 'Not a participant' });

      await db('challenge_results').insert({
        challenge_id,
        user_id,
        score: 1,
        submitted_at: new Date()
      });

      const resultCount = await db('challenge_results').where({ challenge_id }).count();
      if (parseInt(resultCount[0].count, 10) >= participants.length) {
        await db('challenges').where({ id: challenge_id }).update({
          status: 'completed',
          winner_id,
          result_verified: true
        });

        // Use team-aware payout function
        await distributeChallengePrizeWithTeams(challenge_id);
      }

      res.json({ success: true });
    } catch (err) {
      console.error('❌ Result submit failed:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};