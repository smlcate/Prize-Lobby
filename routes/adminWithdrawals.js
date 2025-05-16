const express = require('express');
const router = express.Router();
const db = require('../models/db');
const authenticate = require('../middleware/authenticate');
const verifyAdmin = require('../middleware/verifyAdmin');

// GET /api/admin/withdrawals
router.get('/withdrawals', authenticate, verifyAdmin, async (req, res) => {
  try {
    const withdrawals = await db('withdrawals')
      .leftJoin('users', 'withdrawals.user_id', 'users.id')
      .select(
        'withdrawals.*',
        'users.username as username',
        'users.email as email'
      )
      .orderBy('withdrawals.requested_at', 'desc');

    res.json(withdrawals);
  } catch (err) {
    console.error('[Admin] Failed to load withdrawals:', err);
    res.status(500).json({ error: 'Unable to fetch withdrawals' });
  }
});

// PUT /api/admin/withdrawals/:id/approve
router.put('/withdrawals/:id/approve', authenticate, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db('withdrawals').where({ id }).update({ status: 'approved' });
    res.json({ success: true });
  } catch (err) {
    console.error('[Admin] Failed to approve withdrawal:', err);
    res.status(500).json({ error: 'Approval failed' });
  }
});

// PUT /api/admin/withdrawals/:id/reject
router.put('/withdrawals/:id/reject', authenticate, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db('withdrawals').where({ id }).update({ status: 'rejected' });
    res.json({ success: true });
  } catch (err) {
    console.error('[Admin] Failed to reject withdrawal:', err);
    res.status(500).json({ error: 'Rejection failed' });
  }
});

module.exports = router;