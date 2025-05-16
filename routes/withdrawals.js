
const express = require('express');
const router = express.Router();
const db = require('../models/db');
const authenticate = require('../middleware/authenticate');
const verifyAdmin = require('../middleware/verifyAdmin');

// POST /withdrawals/request - user withdrawal
router.post('/withdrawals/request', authenticate, async (req, res) => {
  const userId = req.user.id;
  const { amount, method, details } = req.body;

  try {
    const settings = await db('platform_settings').first();
    const minAmount = settings.min_withdrawal_amount;

    if (amount < minAmount) {
      return res.status(400).json({
        error: `Minimum withdrawal amount is $${(minAmount / 100).toFixed(2)}`
      });
    }

    const wallet = await db('wallets').where({ user_id: userId }).first();
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    await db('withdrawals').insert({
      user_id: userId,
      amount,
      method: method || 'Unknown',
      details: details || '',
      status: 'pending'
    });

    await db('wallets').where({ user_id: userId }).decrement('balance', amount);

    res.json({ success: true });
  } catch (err) {
    console.error('Error in withdrawal request:', err);
    res.status(500).json({ error: 'Withdrawal request failed' });
  }
});

// GET /admin/withdrawals - admin review
router.get('/admin/withdrawals', authenticate, verifyAdmin, async (req, res) => {
  try {
    const withdrawals = await db('withdrawals')
      .join('users', 'withdrawals.user_id', 'users.id')
      .select(
        'withdrawals.id',
        'withdrawals.amount',
        'withdrawals.method',
        'withdrawals.details',
        'withdrawals.status',
        'withdrawals.created_at',
        'users.username',
        'users.email'
      )
      .orderBy('withdrawals.created_at', 'desc');

    res.json(withdrawals);
  } catch (err) {
    console.error('Error fetching withdrawals:', err);
    res.status(500).json({ error: 'Failed to load withdrawals' });
  }
});

module.exports = router;


// GET /withdrawals/mine - user withdrawal history
router.get('/withdrawals/mine', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const withdrawals = await db('withdrawals')
      .where({ user_id: userId })
      .orderBy('requested_at', 'desc');

    res.json(withdrawals);
  } catch (err) {
    console.error('Error fetching user withdrawals:', err);
    res.status(500).json({ error: 'Failed to load withdrawals' });
  }
});
