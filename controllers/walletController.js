const db = require('../models/db');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getWalletBalance = async (req, res) => {
  try {
    const userId = req.user.id;

    let wallet = await db('wallets').where({ user_id: userId }).first();

    if (!wallet) {
      await db('wallets')
        .insert({ user_id: userId, balance: 0 })
        .onConflict('user_id')
        .ignore();

      wallet = await db('wallets').where({ user_id: userId }).first();
    }

    const history = await db('transactions')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc');

    res.json({ balance: wallet.balance, history });
  } catch (err) {
    console.error('❌ Failed to fetch wallet balance:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.withdrawFunds = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || isNaN(amount)) return res.status(400).json({ error: 'Amount is required' });
    const userId = req.user.id;

    await db('withdrawals').insert({
      user_id: userId,
      amount,
      status: 'pending',
    });

    res.status(200).json({ message: 'Withdrawal request submitted for review' });
  } catch (err) {
    console.error('❌ Error submitting withdrawal request:', err);
    res.status(500).json({ error: 'Could not submit withdrawal request' });
  }
};

exports.createDepositIntent = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;
    if (!amount || isNaN(amount)) return res.status(400).json({ error: 'Invalid amount' });

    const intent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: { userId }
    });

    res.json({ client_secret: intent.client_secret, amount });
  } catch (err) {
    console.error('❌ Error creating deposit intent:', err);
    res.status(500).json({ error: 'Could not create deposit intent' });
  }
};

exports.submitWithdrawalRequest = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const wallet = await db('wallets').where({ user_id: userId }).first();
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    await db('withdrawals').insert({
      user_id: userId,
      amount,
      status: 'pending',
    });

    res.status(200).json({ message: 'Withdrawal request submitted for review' });
  } catch (err) {
    console.error('❌ Error submitting withdrawal request:', err);
    res.status(500).json({ error: 'Could not submit withdrawal request' });
  }
};
