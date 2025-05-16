
const express = require('express');
const router = express.Router();
const db = require('../models/db');
const authenticate = require('../middleware/authenticate');
const verifyAdmin = require('../middleware/verifyAdmin');

// GET /api/admin/disputes
router.get('/disputes', authenticate, verifyAdmin, async (req, res) => {
  try {
    const disputes = await db('disputes')
      .leftJoin('users', 'disputes.user_id', 'users.id') // ✅ fixed column name
      .leftJoin('challenges', 'disputes.challenge_id', 'challenges.id')
      .select(
        'disputes.id',
        'disputes.reason',
        'disputes.status',
        'disputes.admin_comment',
        'users.username as submitted_by',
        'challenges.title as challenge_title'
      )
      .orderBy('disputes.created_at', 'desc');

    res.json(disputes);
  } catch (err) {
    console.error('Error loading disputes:', err);
    res.status(500).json({ error: 'Failed to load disputes' });
  }
});

module.exports = router;
