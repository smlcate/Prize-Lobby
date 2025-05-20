const db = require('../models/db');

const VALID_METHODS = ['paypal', 'venmo', 'cashapp', 'stripe'];

exports.requestWithdrawal = async (req, res) => {
  const user_id = req.user.id;
  const { amount, method, details } = req.body;

  if (!VALID_METHODS.includes(method?.toLowerCase())) {
    return res.status(400).json({ error: 'Invalid withdrawal method.' });
  }

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid withdrawal amount' });
  }

  try {
    const wallet = await db('wallets').where({ user_id }).first();
    const settings = await db('platform_settings').first();
    const minWithdrawal = settings?.min_withdrawal || 500;

    if (wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    if (amount < minWithdrawal) {
      return res.status(400).json({ error: `Minimum withdrawal is $${minWithdrawal / 100}` });
    }

    await db('wallets').where({ user_id }).update({
      balance: wallet.balance - amount
    });

    await db('withdrawals').insert({
      user_id,
      amount,
      method,
      details,
      status: 'pending',
      requested_at: new Date()
    });

    res.status(201).json({ message: 'Withdrawal request submitted' });
  } catch (err) {
    console.error('Withdrawal error:', err);
    res.status(500).json({ error: 'Withdrawal failed' });
  }
};

exports.getWithdrawals = async (req, res) => {
  try {
    const withdrawals = await db('withdrawals')
      .where({ user_id: req.user.id })
      .orderBy('requested_at', 'desc');
    res.json(withdrawals);
  } catch (err) {
    console.error('Error fetching withdrawals:', err);
    res.status(500).json({ error: 'Failed to load withdrawals' });
  }
};