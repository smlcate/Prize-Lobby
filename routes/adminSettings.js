const express = require('express');
const router = express.Router();
const db = require('../models/db');
const authenticate = require('../middleware/authenticate');

// GET platform fee
router.get('/platform-fee', authenticate, async (req, res) => {
  if (!req.user || !req.user.is_admin) return res.sendStatus(403);
  try {
    const setting = await db('platform_settings').first();
    res.json(setting);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load settings' });
  }
});

// PUT update platform fee
router.put('/platform-fee', authenticate, async (req, res) => {
  if (!req.user || !req.user.is_admin) return res.sendStatus(403);
  try {
    const { platform_fee_percent } = req.body;
    await db('platform_settings').update({ platform_fee_percent });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

module.exports = router;
