const db = require('../models/db');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handleStripeWebhook = async (req, res) => {
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

  if (event.type === 'payment_intent.succeeded') {
    const alreadyProcessed = await db('stripe_events').where({ event_id: event.id }).first();
    if (alreadyProcessed) {
      console.log('⚠️ Stripe event already processed:', event.id);
      return res.status(200).json({ received: true });
    }
    await db('stripe_events').insert({ event_id: event.id });
    const intent = event.data.object;
    const userId = parseInt(intent.metadata.user_id, 10);
    const amount = intent.amount;

    try {
      await db('wallets').where({ user_id: userId }).increment('balance', amount);
      await db('transactions').insert({ user_id: userId, amount, type: 'deposit' });
      return res.status(200).json({ received: true });
    } catch (dbErr) {
      console.error('❌ Failed to credit wallet:', dbErr);
      return res.status(500).json({ error: 'DB update failed' });
    }
  } else {
    console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
};
