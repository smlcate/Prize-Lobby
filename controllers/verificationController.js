const db = require('../models/db');
const env = process.env.NODE_ENV;

const getRecentRocketLeagueMatch = env === 'production'
  ? require('../utils/tracker').getRecentMatches
  : require('../lib/trackerStub');

exports.verifyChallenge = async (req, res) => {
  try {
    const challengeId = req.params.id;
    const challenge = await db('challenges').where({ id: challengeId }).first();
    if (!challenge) return res.status(404).json({ error: 'Challenge not found' });
    if (challenge.status !== 'in_progress') {
      return res.status(400).json({ error: 'Challenge not in progress' });
    }

    const participants = await db('challenges_participants')
      .join('gamertags', 'challenges_participants.user_id', '=', 'gamertags.user_id')
      .where({ challenge_id: challengeId });

    if (participants.length !== 2) {
      return res.status(400).json({ error: 'Must have 2 participants for verification' });
    }

    const [p1, p2] = participants;
    const matchData1 = await getRecentRocketLeagueMatch(challenge.game, challenge.platform, p1.gamertag);
    const matchData2 = await getRecentRocketLeagueMatch(challenge.game, challenge.platform, p2.gamertag);

    if (!matchData1 || !matchData2) {
      return res.status(500).json({ error: 'Unable to retrieve match data from tracker' });
    }

    const goals1 = matchData1.stats?.core?.goals || 0;
    const goals2 = matchData2.stats?.core?.goals || 0;
    const winnerId = goals1 > goals2 ? p1.user_id : (goals2 > goals1 ? p2.user_id : null);

    await db('challenges').where({ id: challengeId }).update({
      status: 'completed',
      winner_id: winnerId,
      completed_at: db.fn.now()
    });

    return res.json({
      verified: true,
      winner_id: winnerId,
      score: { [p1.user_id]: goals1, [p2.user_id]: goals2 }
    });
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
