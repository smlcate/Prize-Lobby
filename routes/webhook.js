const express = require('express');
const router = express.Router();
const db = require('../models/db');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Stripe requires raw body for webhook signature
const bodyParser = require('body-parser');
router.use(bodyParser.raw({ type: 'application/json' }));

router.post('/', async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object;
    const userId = parseInt(intent.metadata.user_id, 10); // ✅ fix: ensure numeric match
    const amount = intent.amount;

    console.log(`💵 PaymentIntent succeeded for user ${userId}, amount: ${amount}`);

    try {
      // Credit user's wallet
      await db('wallets').where({ user_id: userId }).increment('balance', amount);

      // Log transaction
      await db('transactions').insert({
        user_id: userId,
        amount,
        type: 'deposit'
      });

      return res.status(200).json({ received: true });
    } catch (dbErr) {
      console.error('❌ Failed to credit wallet:', dbErr);
      return res.status(500).json({ error: 'DB update failed' });
    }
  } else {
    console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
});

module.exports = router;
