// File: controllers/bracketController.js (updated to support polling and verification display)

const express = require('express');
const router = express.Router();
const db = require('../models/db');
const axios = require('axios');

const TRACKER_API_KEY = process.env.TRACKER_API_KEY;
const TRACKER_API_URL = 'https://public-api.tracker.gg/v2/rocket-league/standard/profile';

// Get bracket data (with status + player stats if available)
router.get('/:event_id', async (req, res) => {
  const event_id = req.params.event_id;

  try {
    const matches = await db('bracket_matches').where({ event_id });
    const participants = await db('event_participants').where({ event_id });
    const event = await db('events').where({ id: event_id }).first();

    // Fetch player stats from Tracker.gg
    const playersWithStats = await Promise.all(participants.map(async (p) => {
      const tag = await db('gamertags')
        .where({ user_id: p.user_id, platform: event.platform })
        .first();
      if (!tag) return { user_id: p.user_id, gamertag: null, stats: null };

      try {
        const response = await axios.get(`${TRACKER_API_URL}/${tag.platform}/${encodeURIComponent(tag.gamertag)}`, {
          headers: { 'TRN-Api-Key': TRACKER_API_KEY }
        });
        return {
          user_id: p.user_id,
          gamertag: tag.gamertag,
          stats: response.data.data?.segments?.[0]?.stats || null
        };
      } catch (err) {
        console.warn('⚠️ Tracker.gg fetch error:', err.response?.data || err.message);
        return { user_id: p.user_id, gamertag: tag.gamertag, stats: null };
      }
    }));

    res.json({
      event,
      matches,
      players: playersWithStats
    });
  } catch (err) {
    console.error('❌ Failed to load bracket:', err);
    res.status(500).json({ error: 'Failed to load bracket' });
  }
});

module.exports = router;
