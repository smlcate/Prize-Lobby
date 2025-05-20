const db = require('../models/db');
const teamWalletService = require('../services/teamWalletService');

async function getPlatformFeePercent() {
  const setting = await db('platform_settings').first();
  return setting?.platform_fee_percent || 10;
}

async function distributeChallengePrizeWithTeams(challengeId) {
  const challenge = await db('challenges').where({ id: challengeId }).first();
  if (!challenge || challenge.status !== 'completed') throw new Error('Invalid challenge');

  const platformFeePercent = await getPlatformFeePercent();
  const totalPrize = challenge.prize_pool;
  const platformFee = Math.floor(totalPrize * platformFeePercent / 100);
  const winnerPrize = totalPrize - platformFee;

  const winner = await db('challenge_results as r')
    .join('challenge_participants as p', 'r.challenge_id', 'p.challenge_id')
    .where('r.challenge_id', challengeId)
    .andWhere('r.user_id', db.raw('p.user_id'))
    .orderBy('r.score', 'desc')
    .first('r.user_id', 'r.score', 'p.team_id');

  if (!winner) throw new Error('No winner found');

  const payoutOps = [];

  if (winner.team_id) {
    // Credit the team wallet
    payoutOps.push(teamWalletService.recordTransaction(
      winner.team_id,
      winnerPrize,
      'team_prize',
      { challenge_id: challengeId, winner_user_id: winner.user_id }
    ));
  } else {
    // Credit the user's personal wallet
    payoutOps.push(
      db('wallets').where({ user_id: winner.user_id }).increment('balance', winnerPrize),
      db('transactions').insert({ user_id: winner.user_id, amount: winnerPrize, type: 'prize' })
    );
  }

  // Add platform fee
  payoutOps.push(
    db('transactions').insert({ user_id: 1, amount: platformFee, type: 'platform_fee' })
  );

  await db.transaction(async trx => {
    for (const op of payoutOps) await trx.raw(op.toString ? op.toString() : op);
  });

  return { winner_id: winner.user_id, prize: winnerPrize, team_id: winner.team_id || null };
}

module.exports = {
  distributeChallengePrizeWithTeams
};