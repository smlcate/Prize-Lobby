const express = require('express');
const router = express.Router();
const db = require('../models/db');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

const { Parser } = require('json2csv');

router.get('/transactions/export', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const data = await db('transactions')
      .join('users', 'transactions.user_id', 'users.id')
      .select(
        'transactions.id',
        'users.email',
        'transactions.type',
        'transactions.amount',
        'transactions.ref',
        'transactions.created_at'
      )
      .orderBy('transactions.created_at', 'desc');

    const fields = ['id', 'email', 'type', 'amount', 'ref', 'created_at'];
    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment('transactions.csv');
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ error: 'Failed to export transactions' });
  }
});

router.get('/withdrawals/export', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const withdrawals = await db('withdrawals')
      .join('users', 'withdrawals.user_id', 'users.id')
      .select(
        'withdrawals.id',
        'users.email',
        'withdrawals.amount',
        'withdrawals.method',
        'withdrawals.details',
        'withdrawals.status',
        'withdrawals.requested_at',
        'withdrawals.processed_at'
      )
      .orderBy('withdrawals.requested_at', 'desc');

    const fields = [
      'id',
      'email',
      'amount',
      'method',
      'details',
      'status',
      'requested_at',
      'processed_at'
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(withdrawals);

    res.header('Content-Type', 'text/csv');
    res.attachment('withdrawals.csv');
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ error: 'Failed to export withdrawals' });
  }
});


// GET current platform fee
router.get('/settings/platform-fee', verifyToken, verifyAdmin, async (req, res) => {
  const setting = await db('settings').where({ key: 'platform_fee_percent' }).first();
  res.json({ fee: setting?.value || '10' });
});

// UPDATE platform fee
router.post('/settings/platform-fee', verifyToken, verifyAdmin, async (req, res) => {
  const { fee } = req.body;

  if (!fee || isNaN(fee)) {
    return res.status(400).json({ error: 'Invalid fee value' });
  }

  await db('settings')
    .insert({ key: 'platform_fee_percent', value: fee.toString() })
    .onConflict('key')
    .merge();

  res.status(200).json({ message: 'Platform fee updated' });
});

router.get('/events', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const events = await db('events')
      .select('id', 'title', 'game', 'platform', 'status', 'prize_pool', 'created_at')
      .orderBy('created_at', 'desc');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load events' });
  }
});

// Get all withdrawal requests
router.get('/withdrawals', verifyToken, verifyAdmin, async (req, res) => {
  const list = await db('withdrawals')
    .join('users', 'users.id', 'withdrawals.user_id')
    .select('withdrawals.*', 'users.email')
    .orderBy('requested_at', 'desc');

  res.json(list);
});

// Approve withdrawal
router.post('/withdrawals/:id/approve', verifyToken, verifyAdmin, async (req, res) => {
  await db('withdrawals')
    .where({ id: req.params.id })
    .update({ status: 'approved', processed_at: new Date() });

  res.json({ message: 'Approved' });
});

// Reject withdrawal
router.post('/withdrawals/:id/reject', verifyToken, verifyAdmin, async (req, res) => {
  const wd = await db('withdrawals').where({ id: req.params.id }).first();

  await db.transaction(async trx => {
    await trx('withdrawals')
      .where({ id: wd.id })
      .update({ status: 'rejected', processed_at: new Date() });

    await trx('users')
      .where({ id: wd.user_id })
      .increment('wallet_balance', wd.amount);

    await trx('transactions').insert({
      user_id: wd.user_id,
      type: 'withdrawal_refund',
      amount: wd.amount,
      ref: `rejected:${wd.id}`
    });
  });

  res.json({ message: 'Rejected and refunded' });
});


module.exports = router;
