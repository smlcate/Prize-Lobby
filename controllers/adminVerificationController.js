const db = require('../models/db');
const { verifyApexMatch } = require('../utils/apexVerifyHelper');

exports.triggerManualVerification = async (req, res) => {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({ error: 'Admin access required.' });
  }

  const now = new Date();
  const graceBuffer = new Date(now.getTime() - 5 * 60 * 1000);

  try {
    const matches = await db('bracket_matches')
      .where({ result_verified: false, status: 'in_progress' })
      .andWhere('start_time', '<', graceBuffer);

    for (const match of matches) {
      const players = [
        { id: match.player1_id, field: 'player1_id' },
        { id: match.player2_id, field: 'player2_id' }
      ];

      for (const player of players) {
        const gamertag = await db('gamertags').where({ user_id: player.id }).first();
        if (!gamertag) continue;

        if (gamertag.gamertag.startsWith('test_')) {
          const kills = Math.floor(Math.random() * 10);
          const damage = Math.floor(Math.random() * 2000);
          const scoreData = { kills, damage, match_id: 'manual-sim-' + Date.now() };

          await db('bracket_matches')
            .where({ id: match.id })
            .update({
              result_verified: true,
              score_data: JSON.stringify(scoreData)
            });
          continue;
        }

        await verifyApexMatch(
          player.id,
          gamertag.platform,
          gamertag.gamertag,
          {
            match_id: match.id,
            started_at: match.start_time || match.created_at
          }
        );
      }
    }

    return res.json({ success: true, message: 'Manual verification and bracket advancement triggered.' });
  } catch (err) {
    console.error('Admin manual trigger failed:', err);
    res.status(500).json({ error: 'Failed to run verification', details: err.message });
  }
};
