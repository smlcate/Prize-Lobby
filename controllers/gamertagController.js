
const axios = require('axios');
const db = require('../models/db');

const TRACKER_API_KEY = process.env.TRACKER_API_KEY;
const TRACKER_API_URL = 'https://public-api.tracker.gg/v2/rocket-league/standard/profile';

// Validate a gamertag against Tracker.gg and update its record
exports.validateGamertag = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { platform, gamertag } = req.body;

    if (!platform || !gamertag) {
      return res.status(400).json({ error: 'Missing platform or gamertag' });
    }

    const tracker_profile_url = `https://rocketleague.tracker.network/rocket-league/profile/${platform}/${encodeURIComponent(gamertag)}`;

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

exports.addGamertag = async (req, res) => {
  const userId = req.user.id;
  const { platform, gamertag } = req.body;

  if (!platform || !gamertag) {
    return res.status(400).json({ error: 'Missing platform or gamertag' });
  }

  try {
    const result = await db('gamertags')
      .insert({
        user_id: userId,
        platform,
        gamertag,
        tracker_profile_url: `https://rocketleague.tracker.network/rocket-league/profile/${platform}/${encodeURIComponent(gamertag)}`
      })
      .returning('*');

    res.status(201).json(result[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Gamertag already exists for this platform' });
    }
    console.error('[addGamertag]', err);
    res.status(500).json({ error: 'Failed to add gamertag' });
  }
};

exports.updateGamertag = async (req, res) => {
  const userId = req.user.id;
  const gamertagIdOrPlatform = req.params.id;
  const { gamertag } = req.body;

  if (!gamertag) {
    return res.status(400).json({ error: 'Missing new gamertag' });
  }

  try {
    const query = db('gamertags').where({ user_id: userId });
    const idAsInt = parseInt(gamertagIdOrPlatform, 10);

    if (!isNaN(idAsInt)) {
      query.andWhere({ id: idAsInt });
    } else {
      query.andWhere({ platform: gamertagIdOrPlatform });
    }

    const updated = await query.update({
      gamertag,
      tracker_profile_url: `https://rocketleague.tracker.network/rocket-league/profile/${gamertagIdOrPlatform}/${encodeURIComponent(gamertag)}`
    }).returning('*');

    if (!updated.length) {
      return res.status(404).json({ error: 'Gamertag not found for update' });
    }

    res.status(200).json(updated[0]);
  } catch (err) {
    console.error('❌ Updating gamertag failed:', err);
    res.status(500).json({ error: 'Failed to update gamertag' });
  }
};

exports.deleteGamertag = async (req, res) => {
  const userId = req.user.id;
  const gamertagIdOrPlatform = req.params.id;

  try {
    const query = db('gamertags').where({ user_id: userId });
    const idAsInt = parseInt(gamertagIdOrPlatform, 10);

    if (!isNaN(idAsInt)) {
      query.andWhere({ id: idAsInt });
    } else {
      query.andWhere({ platform: gamertagIdOrPlatform });
    }

    const deleted = await query.del();

    if (deleted) {
      res.status(200).json({ message: 'Gamertag deleted successfully' });
    } else {
      res.status(404).json({ error: 'Gamertag not found' });
    }
  } catch (err) {
    console.error('❌ Deleting gamertag failed:', err);
    res.status(500).json({ error: 'Failed to delete gamertag' });
  }
};
