// routes/tracker.js
const express = require('express');
const router = express.Router();
const db = require('../models/db');
const axios = require('axios');
const authenticate = require('../middleware/authenticate');

const TRACKER_API_KEY = process.env.TRACKER_API_KEY;
const TRACKER_BASE_URL = 'https://public-api.tracker.gg/v2/rocket-league/standard/profile';

// GET /api/tracker/rocket-league/match/:eventId
router.get('/rocket-league/match/:eventId', authenticate, async (req, res) => {
  const eventId = parseInt(req.params.eventId);
  const requestingUser = req.user.id;

  try {
    // 1. Load participants and their gamertags
    const participants = await db('event_participants as ep')
      .join('gamertags as gt', 'ep.user_id', 'gt.user_id')
      .select('ep.user_id', 'gt.platform', 'gt.gamertag')
      .where('ep.event_id', eventId);

    if (participants.length !== 2) {
      return res.status(400).json({ error: 'This match requires exactly 2 players for verification.' });
    }

    // 2. Fetch Tracker.gg match history for each
    const histories = await Promise.all(participants.map(async (p) => {
      const url = `${TRACKER_BASE_URL}/${encodeURIComponent(p.platform)}/${encodeURIComponent(p.gamertag)}`;
      const response = await axios.get(url, {
        headers: { 'TRN-Api-Key': TRACKER_API_KEY }
      });

      const matches = response.data.data.matches || [];
      return { user_id: p.user_id, matches };
    }));

    // 3. Find shared match
    const player1 = histories[0];
    const player2 = histories[1];
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

    // 4. Determine winner by score
    const score1 = matchedGame.p1.stats.core.goals;
    const score2 = matchedGame.p2.stats.core.goals;
    let winnerId = null;
    if (score1 > score2) winnerId = player1.user_id;
    else if (score2 > score1) winnerId = player2.user_id;

    // 5. Update DB (assume one bracket match per event for now)
    await db('bracket_matches')
      .where({ event_id: eventId })
      .update({
        result_verified: true,
        score_player_1: score1,
        score_player_2: score2,
        winner_id: winnerId
      });

    // 6. Credit winner's wallet
    if (winnerId) {
      const winnerWallet = await db('wallets').where({ user_id: winnerId }).first();
      await db('wallets').where({ user_id: winnerId })
        .update({ balance: winnerWallet.balance + 2 * (await db('events').where({ id: eventId }).first()).entry_fee });
    }

    res.json({ message: 'Match verified', scores: { [player1.user_id]: score1, [player2.user_id]: score2 }, winnerId });
  } catch (err) {
    console.error('❌ Tracker verification failed:', err.message);
    res.status(500).json({ error: 'Verification error', detail: err.message });
  }
});

module.exports = router;
