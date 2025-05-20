const db = require('../models/db');

// GET /api/admin/withdrawals
exports.getAllWithdrawals = async (req, res) => {
  try {
    const withdrawals = await db('withdrawals').orderBy('created_at', 'desc');
    res.json(withdrawals);
  } catch (err) {
    console.error('Failed to fetch withdrawals:', err);
    res.status(500).json({ error: 'Failed to load withdrawals' });
  }
};

// POST /api/admin/withdrawals/:id/approve
exports.approveWithdrawal = async (req, res) => {
  const withdrawalId = req.params.id;
  try {
    const withdrawal = await db('withdrawals').where({ id: withdrawalId }).first();
    if (!withdrawal || withdrawal.status !== 'pending') {
      return res.status(400).json({ error: 'Invalid or already processed withdrawal' });
    }

    await db('withdrawals').where({ id: withdrawalId }).update({ status: 'approved' });

    await db('transactions').insert({
      user_id: withdrawal.user_id,
      type: 'withdrawal_approved',
      amount: -withdrawal.amount,
      metadata: JSON.stringify({ method: withdrawal.method, details: withdrawal.details })
    });

    res.json({ message: 'Withdrawal approved and marked as processed' });
  } catch (err) {
    console.error('Error approving withdrawal:', err);
    res.status(500).json({ error: 'Failed to approve withdrawal' });
  }
};

// POST /api/admin/withdrawals/:id/deny
exports.denyWithdrawal = async (req, res) => {
  const withdrawalId = req.params.id;
  try {
    const withdrawal = await db('withdrawals').where({ id: withdrawalId }).first();
    if (!withdrawal || withdrawal.status !== 'pending') {
      return res.status(400).json({ error: 'Invalid or already processed withdrawal' });
    }

    await db('wallets')
      .where({ user_id: withdrawal.user_id })
      .increment('balance', withdrawal.amount);

    await db('withdrawals').where({ id: withdrawalId }).update({ status: 'denied' });

    await db('transactions').insert({
      user_id: withdrawal.user_id,
      type: 'withdrawal_denied',
      amount: 0,
      metadata: JSON.stringify({ original_amount: withdrawal.amount, reason: 'Denied by admin' })
    });

    res.json({ message: 'Withdrawal denied and balance refunded' });
  } catch (err) {
    console.error('Error denying withdrawal:', err);
    res.status(500).json({ error: 'Failed to deny withdrawal' });
  }
};
