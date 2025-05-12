const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../models/db');

// Stripe raw body must be handled here only
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  console.log('🔥 Webhook hit');

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log('✅ Webhook event:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const amount = session.amount_total;

      console.log(`💰 Crediting user ${userId} with $${amount / 100}`);

      await db('users').where({ id: userId }).increment('wallet_balance', amount);

      await db('transactions').insert({
        user_id: userId,
        type: 'deposit',
        amount,
        ref: session.id
      });

      console.log('✅ Wallet updated');
    }

    res.status(200).send('ok');
  } catch (err) {
    console.error('❌ Stripe webhook error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

module.exports = router;
