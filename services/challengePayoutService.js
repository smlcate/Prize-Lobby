const db = require('../models/db');

async function distributeChallengeReward(challengeId) {
  const challenge = await db('challenges').where({ id: challengeId }).first();
  if (!challenge) throw new Error('Challenge not found');
  if (!challenge.winner_id) throw new Error('No winner set');
  if (challenge.paid_out) {
    console.log(`Challenge ${challengeId} already paid out.`);
    return;
  }

  const winnerWallet = await db('wallets').where({ user_id: challenge.winner_id }).first();
  if (!winnerWallet) throw new Error('Winner wallet not found');

  const prize = challenge.prize || challenge.prize_pool || 0;
  const fee = parseInt(challenge.platform_fee || 0);
  const netPrize = Math.max(0, prize - fee);

  await db('wallets')
    .where({ user_id: challenge.winner_id })
    .increment('balance', netPrize);

  await db('transactions').insert({
    user_id: challenge.winner_id,
    type: 'prize_payout',
    amount: netPrize,
    challenge_id: challengeId,
    metadata: JSON.stringify({ originalPrize: prize, fee })
  });

  await db('challenges').where({ id: challengeId }).update({ paid_out: true });

  console.log(`💰 Paid ${netPrize} to user ${challenge.winner_id} for Challenge ${challengeId}`);
}

module.exports = { distributeChallengeReward };
