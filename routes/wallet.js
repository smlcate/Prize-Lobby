// routes/wallet.js
const express = require('express');
const router = express.Router();
const db = require('../models/db');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// const authenticate = require('../middleware/authenticate'); // Re-enable when needed

console.log('📦 routes/wallet.js loaded');

// Ping
router.get('/ping', (_req, res) => {
  console.log('📶 /api/wallet/ping HIT');
  res.json({ pong: true });
});

// Get wallet balance
router.get('/balance', async (req, res) => {
  console.log('🔁 GET /api/wallet/balance HIT (no auth)');
  try {
    const userId = req.user?.id || 1;
    console.log('👤 Using user_id:', userId);
    const wallet = await db('wallets').where({ user_id: userId }).first();
    console.log('💰 Wallet:', wallet);
    if (!wallet) {
      await db('wallets').insert({ user_id: userId, balance: 0 });
      return res.json({ balance: 0 });
      return res.status(404).json({ error: 'Wallet not found' });
    }
    res.json({ balance: wallet.balance });
  } catch (err) {
    console.error('❌ Failed to fetch wallet balance:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Withdraw funds
router.post('/withdraw', async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user?.id || 1;
    const wallet = await db('wallets').where({ user_id: userId }).first();
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }
    await db('wallets')
      .where({ user_id: userId })
      .update({ balance: wallet.balance - amount });
    res.json({ message: 'Withdrawal successful' });
  } catch (err) {
    console.error('❌ Withdrawal failed:', err);
    res.status(500).json({ error: 'Withdrawal failed' });
  }
});

// Stripe Checkout
router.post('/checkout', async (req, res) => {
  const { amount } = req.body;
  const userId = req.user?.id || 1;
  if (!amount || amount < 100) {
    return res.status(400).json({ error: 'Minimum amount is $1 (100 cents)' });
  }
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'PrizeLobby Wallet Deposit' },
          unit_amount: amount
        },
        quantity: 1
      }],
      success_url: `${process.env.CLIENT_BASE_URL}/#/wallet?success=true`,
      cancel_url:  `${process.env.CLIENT_BASE_URL}/#/wallet?canceled=true`,
      metadata: { user_id: userId }
    });
    console.log('💳 Stripe Checkout URL:', session.url);
    res.json({ url: session.url });
  } catch (err) {
    console.error('❌ Stripe checkout error:', err);
    res.status(500).json({ error: 'Checkout session creation failed' });
  }
});

module.exports = router;



// Create a deposit payment intent (Authenticated)
const authenticate = require('../middleware/authenticate');
router.post('/deposit/intent', authenticate, async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user?.id;

    if (!amount || isNaN(amount) || amount < 100) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: { user_id: userId }
    });

    res.json({ client_secret: paymentIntent.client_secret, amount });
  } catch (err) {
    console.error('❌ Failed to create deposit intent:', err);
    res.status(500).json({ error: 'Failed to create deposit intent' });
  }
});
