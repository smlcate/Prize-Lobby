const db = require('../models/db');

exports.getAllEvents = async (req, res) => {
  try {
    const events = await db('events').orderBy('created_at', 'desc');
    res.json(events);
  } catch (err) {
    console.error('[GET /api/admin/events]', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

exports.getAllChallenges = async (req, res) => {
  try {
    const challenges = await db('challenges').orderBy('created_at', 'desc');
    res.json(challenges);
  } catch (err) {
    console.error('[GET /api/admin/challenges]', err);
    res.status(500).json({ error: 'Failed to fetch challenges' });
  }
};

exports.getAllBracketMatches = async (req, res) => {
  try {
    const matches = await db('bracket_matches').orderBy('created_at', 'desc');
    res.json(matches);
  } catch (err) {
    console.error('[GET /api/admin/bracket-matches]', err);
    res.status(500).json({ error: 'Failed to fetch bracket matches' });
  }
};

exports.verifyMatchManually = async (req, res) => {
  const matchId = parseInt(req.params.id);
  const { winner_id, type } = req.body;

  try {
    if (type === 'bracket') {
      const updated = await db('bracket_matches')
        .where({ id: matchId })
        .update({
          winner_id,
          result_verified: true,
          status: 'complete',
          updated_at: new Date()
        });
      return res.json({ success: true, updated });
    }

    if (type === 'challenge') {
      await db('challenges_participants')
        .where({ challenge_id: matchId })
        .update({ result_verified: true });

      await db('challenges_participants')
        .where({ challenge_id: matchId, user_id: winner_id })
        .update({ is_winner: true });

      return res.json({ success: true });
    }

    res.status(400).json({ error: 'Invalid match type' });
  } catch (err) {
    console.error('[POST /api/admin/matches/:id/verify]', err);
    res.status(500).json({ error: 'Failed to verify match' });
  }
};

exports.getPlatformFee = async (req, res) => {
  try {
    res.json({ platform_fee: 0.10 });
  } catch (err) {
    console.error('[GET /api/admin/settings/platform-fee]', err);
    res.status(500).json({ error: 'Failed to fetch platform fee' });
  }
};

exports.getAllWithdrawals = async (req, res) => {
  try {
    const withdrawals = await db('withdrawals')
      .join('users', 'withdrawals.user_id', '=', 'users.id')
      .select(
        'withdrawals.id',
        'withdrawals.user_id',
        'withdrawals.amount',
        'withdrawals.method',
        'withdrawals.details',
        'withdrawals.status',
        'withdrawals.requested_at',
        'withdrawals.reviewed_at',
        'users.email'
      )
      .orderBy('withdrawals.requested_at', 'desc');

    res.json(withdrawals);
  } catch (err) {
    console.error('[GET /api/admin/withdrawals]', err);
    res.status(500).json({ error: 'Failed to fetch withdrawals' });
  }
};

exports.approveWithdrawal = async (req, res) => {
  try {
    await db('withdrawals')
      .where({ id: req.params.id })
      .update({ status: 'approved', reviewed_at: new Date() });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('[PUT /admin/withdrawals/:id/approve]', err);
    res.status(500).json({ error: 'Approval failed' });
  }
};

exports.rejectWithdrawal = async (req, res) => {
  try {
    const withdrawal = await db('withdrawals').where({ id: req.params.id }).first();

    if (!withdrawal || withdrawal.status !== 'pending') {
      return res.status(400).json({ error: 'Invalid or already processed withdrawal' });
    }

    await db('withdrawals')
      .where({ id: req.params.id })
      .update({ status: 'rejected', reviewed_at: new Date() });

    await db('wallets')
      .where({ user_id: withdrawal.user_id })
      .increment('balance', withdrawal.amount);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('[PUT /admin/withdrawals/:id/reject]', err);
    res.status(500).json({ error: 'Rejection failed' });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await db('transactions')
      .join('users', 'transactions.user_id', '=', 'users.id')
      .select(
        'transactions.id',
        'transactions.user_id',
        'transactions.amount',
        'transactions.type',
        'transactions.created_at',
        'users.email'
      )
      .orderBy('transactions.created_at', 'desc');

    res.json(transactions);
  } catch (err) {
    console.error('[GET /api/admin/transactions]', err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};
