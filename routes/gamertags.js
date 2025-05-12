const express = require('express');
const router = express.Router();
const db = require('../models/db');
const verifyToken = require('../middleware/verifyToken');

// Get all gamertags for current user
router.get('/', verifyToken, async (req, res) => {
  const tags = await db('gamertags').where({ user_id: req.user.id });
  res.json(tags);
});

// Add or update a gamertag (1 per platform)
router.post('/', verifyToken, async (req, res) => {
  const { platform, gamertag } = req.body;
  if (!platform || !gamertag) return res.status(400).json({ error: 'Missing fields' });

  try {
    await db('gamertags')
      .insert({ user_id: req.user.id, platform, gamertag })
      .onConflict(['user_id', 'platform'])
      .merge();

    res.json({ message: 'Gamertag saved' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to save gamertag', details: err.message });
  }
});

// Delete gamertag
router.delete('/:platform', verifyToken, async (req, res) => {
  await db('gamertags')
    .where({ user_id: req.user.id, platform: req.params.platform })
    .del();
  res.json({ message: 'Gamertag deleted' });
});

module.exports = router;
