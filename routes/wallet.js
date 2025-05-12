const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const verifyToken = require('../middleware/verifyToken');
const db = require('../models/db');

// Create a Stripe Checkout session to deposit funds
router.post('/deposit', verifyToken, async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount < 100) {
    return res.status(400).json({ error: 'Amount must be at least $1.00 (100 cents)' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'PrizeLobby Wallet Deposit' },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      success_url: `${process.env.FRONTEND_URL}/#/wallet?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/#/wallet?canceled=true`,
      metadata: {
        userId: req.user.id,
      }
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe session error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get current wallet balance
router.post('/withdraw', verifyToken, async (req, res) => {
  const { amount, method, details } = req.body;

  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

  const user = await db('users').where({ id: req.user.id }).first();

  if (user.wallet_balance < amount) {
    return res.status(403).json({ error: 'Insufficient wallet balance' });
  }

  try {
    await db.transaction(async trx => {
      // Deduct balance
      await trx('users')
        .where({ id: req.user.id })
        .decrement('wallet_balance', amount);

      // Log approved withdrawal
      await trx('withdrawals').insert({
        user_id: req.user.id,
        amount,
        method,
        details,
        status: 'approved',
        processed_at: new Date()
      });

      // Log transaction
      await trx('transactions').insert({
        user_id: req.user.id,
        type: 'withdrawal',
        amount: -amount,
        ref: `auto-approved`
      });
    });

    res.status(200).json({ message: 'Withdrawal processed and approved automatically' });
  } catch (err) {
    console.error('Auto-withdraw error:', err);
    res.status(500).json({ error: 'Failed to process withdrawal' });
  }
});

router.get('/balance', verifyToken, async (req, res) => {
  try {
    const user = await db('users').where({ id: req.user.id }).first();
    res.json({ balance: user.wallet_balance });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get balance' });
  }
});


module.exports = router;
