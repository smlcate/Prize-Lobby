const express = require('express');
const router = express.Router();
const db = require('../models/db');
const verifyToken = require('../middleware/authenticate');

router.get('/', verifyToken, async (req, res) => {
  try {
    const tx = await db('transactions')
      .where({ user_id: req.user.id })
      .orderBy('created_at', 'desc');

    res.json(tx);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

module.exports = router;
