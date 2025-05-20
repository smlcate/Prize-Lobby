
// utils/payout.js
const db = require('../models/db');

async function getPlatformFeePercent() {
  const setting = await db('platform_settings').first();
  return setting?.platform_fee_percent || 10;
}

async function distributeChallengePrize(challengeId) {
  const challenge = await db('challenges').where({ id: challengeId }).first();
  if (!challenge || challenge.status !== 'completed') throw new Error('Invalid challenge');

  const platformFeePercent = await getPlatformFeePercent();
  const totalPrize = challenge.prize_pool;
  const platformFee = Math.floor(totalPrize * platformFeePercent / 100);
  const winnerPrize = totalPrize - platformFee;

  const winners = await db('challenge_results')
    .where({ challenge_id: challengeId })
    .orderBy('score', 'desc')
    .limit(1);

  const winner = winners[0];
  if (!winner) throw new Error('No winner found');

  await db.transaction(async trx => {
    await trx('wallets').where({ user_id: winner.user_id }).increment('balance', winnerPrize);
    await trx('transactions').insert([
      { user_id: winner.user_id, amount: winnerPrize, type: 'prize' },
      { user_id: 1, amount: platformFee, type: 'platform_fee' }
    ]);
  });

  return { winner_id: winner.user_id, prize: winnerPrize };
}

async function distributeEventPrize(eventId) {
  const event = await db('events').where({ id: eventId }).first();
  if (!event || event.status !== 'completed') throw new Error('Invalid event');

  const platformFeePercent = await getPlatformFeePercent();
  const totalPrize = event.prize_pool;
  const platformFee = Math.floor(totalPrize * platformFeePercent / 100);
  const winnerPrize = totalPrize - platformFee;

  const winner = await db('event_participants')
    .where({ event_id: eventId, is_winner: true })
    .first();

  if (!winner) throw new Error('No winner marked');

  await db.transaction(async trx => {
    await trx('wallets').where({ user_id: winner.user_id }).increment('balance', winnerPrize);
    await trx('transactions').insert([
      { user_id: winner.user_id, amount: winnerPrize, type: 'prize' },
      { user_id: 1, amount: platformFee, type: 'platform_fee' }
    ]);
  });

  return { winner_id: winner.user_id, prize: winnerPrize };
}

module.exports = {
  distributeChallengePrize,
  distributeEventPrize
};
