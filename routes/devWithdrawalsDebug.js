const express = require('express');
const router = express.Router();
const db = require('../models/db');
const authenticate = require('../middleware/authenticate');
const verifyAdmin = require('../middleware/verifyAdmin');

// DEV ONLY: GET /api/dev/withdrawals/all
router.get('/withdrawals/all', authenticate, verifyAdmin, async (req, res) => {
  try {
    const all = await db('withdrawals');
    res.json(all);
  } catch (err) {
    console.error('[DEV DEBUG] Failed to load all withdrawals:', err);
    res.status(500).json({ error: 'Unable to fetch withdrawal data' });
  }
});

module.exports = router;