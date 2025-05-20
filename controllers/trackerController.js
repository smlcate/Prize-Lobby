const db = require('../models/db');
const axios = require('axios');

const TRACKER_API_KEY = process.env.TRACKER_API_KEY;
const TRACKER_BASE_URL = 'https://public-api.tracker.gg/v2/rocket-league/standard/profile';

exports.verifyRocketLeagueMatch = async (req, res) => {
  const eventId = parseInt(req.params.eventId);
  const requestingUser = req.user.id;

  try {
    const participants = await db('event_participants as ep')
      .join('gamertags as gt', 'ep.user_id', 'gt.user_id')
      .select('ep.user_id', 'gt.platform', 'gt.gamertag')
      .where('ep.event_id', eventId);

    if (participants.length !== 2) {
      return res.status(400).json({ error: 'This match requires exactly 2 players for verification.' });
    }

    const histories = await Promise.all(participants.map(async (p) => {
      const url = `${TRACKER_BASE_URL}/${encodeURIComponent(p.platform)}/${encodeURIComponent(p.gamertag)}`;
      const response = await axios.get(url, {
        headers: { 'TRN-Api-Key': TRACKER_API_KEY }
      });
      return { user_id: p.user_id, matches: response.data.data.matches || [] };
    }));

    const [player1, player2] = histories;
    let matchedGame = null;

    for (let m1 of player1.matches) {
      for (let m2 of player2.matches) {
        const sameTime = Math.abs(new Date(m1.metadata.timestamp).getTime() - new Date(m2.metadata.timestamp).getTime()) < 60000;
        if (sameTime && m1.id === m2.id) {
          matchedGame = { p1: m1, p2: m2 };
          break;
        }
      }
      if (matchedGame) break;
    }

    if (!matchedGame) {
      return res.status(404).json({ error: 'No shared recent match found for these players.' });
    }

    const score1 = matchedGame.p1.stats.core.goals;
    const score2 = matchedGame.p2.stats.core.goals;
    const winnerId = score1 > score2 ? player1.user_id : score2 > score1 ? player2.user_id : null;

    await db('bracket_matches').where({ event_id: eventId }).update({
      result_verified: true,
      score_player_1: score1,
      score_player_2: score2,
      winner_id: winnerId
    });

    if (winnerId) {
      const event = await db('events').where({ id: eventId }).first();
      await db('wallets').where({ user_id: winnerId }).increment('balance', 2 * event.entry_fee);
    }

    res.json({ message: 'Match verified', scores: { [player1.user_id]: score1, [player2.user_id]: score2 }, winnerId });
  } catch (err) {
    console.error('❌ Tracker verification failed:', err.message);
    res.status(500).json({ error: 'Verification error', detail: err.message });
  }
};
