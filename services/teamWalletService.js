
const db = require('../models/db');

async function createWallet(teamId) {
  return db('team_wallets').insert({ team_id: teamId });
}

async function getBalance(teamId) {
  const wallet = await db('team_wallets').where({ team_id: teamId }).first();
  return wallet ? wallet.balance : 0;
}

async function recordTransaction(teamId, amount, type, metadata = {}) {
  await db('team_wallets')
    .where({ team_id: teamId })
    .increment('balance', amount)
    .update({ updated_at: db.fn.now() });

  await db('team_transactions').insert({
    team_id: teamId,
    amount,
    type,
    metadata
  });
}

async function getTransactionHistory(teamId, limit = 50) {
  try {
    return await db('team_transactions')
    .where({ team_id: teamId })
    .orderBy('created_at', 'desc')
    .limit(limit);
  } catch (err) {
    if (err.code === '42703') {
      console.warn('⚠️ Skipping transaction history: "team_id" column missing');
      return [];
    }
    throw err;
  }
}

module.exports = {
  createWallet,
  getBalance,
  recordTransaction,
  getTransactionHistory
};
