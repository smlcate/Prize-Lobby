const db = require('../models/db');

async function distributeMatchReward(matchId) {
  const match = await db('matches').where({ id: matchId }).first();
  if (!match) throw new Error('Match not found');
  if (!match.winner_id) throw new Error('No winner set');
  if (match.paid_out) {
    console.log(`Match ${matchId} already paid out.`);
    return;
  }

  const wallet = await db('wallets').where({ user_id: match.winner_id }).first();
  if (!wallet) throw new Error('Winner wallet not found');

  const prize = match.prize || 0;
  const fee = parseInt(match.platform_fee || 0);
  const netPrize = Math.max(0, prize - fee);

  await db('wallets')
    .where({ user_id: match.winner_id })
    .increment('balance', netPrize);

  await db('transactions').insert({
    user_id: match.winner_id,
    type: 'match_payout',
    amount: netPrize,
    match_id: matchId,
    metadata: JSON.stringify({ originalPrize: prize, fee })
  });

  await db('matches').where({ id: matchId }).update({ paid_out: true });

  console.log(`💰 Paid ${netPrize} to user ${match.winner_id} for Match ${matchId}`);
}

module.exports = { distributeMatchReward };
