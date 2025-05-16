
const express = require('express');
const router = express.Router();
const db = require('../models/db');
const authenticate = require('../middleware/authenticate');

const apexTracker = require('../controllers/apexTrackerController');
router.get('/apex/:platform/:username', apexTracker.getRecentMatches);

const { verifyApexMatch } = require('../utils/apexVerifyHelper');

// ✅ Match verification endpoint
router.post('/verify', authenticate, async (req, res) => {
  const userId = req.user.id;
  const { platform, username, matchOrChallenge } = req.body;

  try {
    const result = await verifyApexMatch(userId, platform, username, matchOrChallenge);
    res.json(result);
  } catch (err) {
    console.error('[POST /api/matches/verify]', err);
    res.status(500).json({ error: 'Verification failed', details: err.message });
  }
});

// ✅ Match info lookup (challenges or brackets)
router.get('/:id', authenticate, async (req, res) => {
  const matchId = parseInt(req.params.id);
  const userId = req.user.id;

  try {
    const challenge = await db('challenges').where({ id: matchId }).first();
    if (challenge) {
      const participants = await db('challenges_participants')
        .where({ challenge_id: matchId });

      return res.json({
        id: challenge.id,
        type: 'challenge',
        game: challenge.game,
        platform: challenge.platform,
        title: challenge.title,
        status: challenge.status,
        participants
      });
    }

    const bracket = await db('bracket_matches').where({ id: matchId }).first();
    if (bracket) {
      const [player1Tag, player2Tag] = await Promise.all([
        db('gamertags').where({ user_id: bracket.player1_id }).first(),
        db('gamertags').where({ user_id: bracket.player2_id }).first()
      ]);

      return res.json({
        id: bracket.id,
        type: 'bracket',
        event_id: bracket.event_id,
        round: bracket.round,
        match_number: bracket.match_number,
        player1: {
          id: bracket.player1_id,
          gamertag: player1Tag?.gamertag || 'Unknown'
        },
        player2: {
          id: bracket.player2_id,
          gamertag: player2Tag?.gamertag || 'Unknown'
        },
        winner_id: bracket.winner_id,
        tracker_match_id: bracket.tracker_match_id,
        result_verified: bracket.result_verified,
        status: bracket.status
      });
    }

    res.status(404).json({ error: 'Match not found' });
  } catch (err) {
    console.error('[GET /api/matches/:id]', err);
    res.status(500).json({ error: 'Failed to fetch match' });
  }
});

module.exports = router;
