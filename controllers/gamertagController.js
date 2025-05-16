// controllers/gamertagController.js
const axios = require('axios');
const db = require('../models/db');

const TRACKER_API_KEY = process.env.TRACKER_API_KEY;
const TRACKER_API_URL = 'https://public-api.tracker.gg/v2/rocket-league/standard/profile';

// Validate a gamertag against Tracker.gg and update its record
// controllers/gamertagController.js

exports.validateGamertag = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { platform, gamertag } = req.body;

    if (!platform || !gamertag) {
      return res.status(400).json({ error: 'Missing platform or gamertag' });
    }

    // 🚧 MOCK MODE — simulating a successful validation
    const tracker_profile_url = `https://tracker.gg/rocket-league/profile/${platform}/${encodeURIComponent(gamertag)}`;

    const updated = await db('gamertags')
      .where({ user_id, platform, gamertag })
      .update({
        validated_at: new Date(),
        tracker_profile_url
      })
      .returning('*');

    res.status(200).json({
      message: 'Gamertag validated (mock)',
      gamertag: updated[0]
    });
  } catch (err) {
    console.error('[validateGamertag]', err.message);
    res.status(500).json({ error: 'Failed to validate gamertag' });
  }
};



exports.getUserGamertags = async (req, res) => {
  try {
    const tags = await db('gamertags')
      .where({ user_id: req.user.id })
      .select('id', 'platform', 'gamertag', 'tracker_profile_url', 'validated_at');

    res.json(tags);
  } catch (err) {
    console.error('❌ Fetching gamertags failed:', err);
    res.status(500).json({ error: 'Failed to fetch gamertags' });
  }
};

exports.deleteGamertag = async (req, res) => {
  const userId = req.user.id;
  const gamertagId = req.params.id;

  try {
    const deleted = await db('gamertags')
      .where({ id: gamertagId, user_id: userId })
      .del();

    if (deleted) {
      res.json({ success: true, message: 'Gamertag deleted' });
    } else {
      res.status(404).json({ error: 'Gamertag not found' });
    }
  } catch (err) {
    console.error('❌ Deleting gamertag failed:', err);
    res.status(500).json({ error: 'Failed to delete gamertag' });
  }
};


// Add new gamertag
exports.addGamertag = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { platform, gamertag } = req.body;

    if (!platform || !gamertag) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const tracker_profile_url = `https://rocketleague.tracker.network/rocket-league/profile/${platform}/${encodeURIComponent(gamertag)}`;

    const result = await db('gamertags').insert({
      user_id,
      platform,
      gamertag,
      tracker_profile_url,
      validated_at: null
    }).returning('*');

    res.status(201).json(result[0]);
  } catch (err) {
    console.error('[addGamertag]', err);
    res.status(500).json({ error: 'Failed to add gamertag' });
  }
};
