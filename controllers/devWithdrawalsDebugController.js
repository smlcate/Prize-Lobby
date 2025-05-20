const db = require('../models/db');

exports.getAllWithdrawals = async (req, res) => {
  try {
    const all = await db('withdrawals');
    res.json(all);
  } catch (err) {
    console.error('[DEV DEBUG] Failed to load all withdrawals:', err);
    res.status(500).json({ error: 'Unable to fetch withdrawal data' });
  }
};
