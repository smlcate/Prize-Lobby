const db = require('../models/db');
const teamWalletService = require('../services/teamWalletService');

async function getPlatformFeePercent() {
  const setting = await db('platform_settings').first();
  return setting?.platform_fee_percent || 10;
}

async function distributeEventPrizeWithTeams(eventId) {
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

  const payoutOps = [];

  if (winner.team_id) {
    payoutOps.push(teamWalletService.recordTransaction(
      winner.team_id,
      winnerPrize,
      'team_prize',
      { event_id: eventId, winner_user_id: winner.user_id }
    ));
  } else {
    payoutOps.push(
      db('wallets').where({ user_id: winner.user_id }).increment('balance', winnerPrize),
      db('transactions').insert({ user_id: winner.user_id, amount: winnerPrize, type: 'prize' })
    );
  }

  payoutOps.push(
    db('transactions').insert({ user_id: 1, amount: platformFee, type: 'platform_fee' })
  );

  await db.transaction(async trx => {
    for (const op of payoutOps) await trx.raw(op.toString ? op.toString() : op);
  });

  return { winner_id: winner.user_id, prize: winnerPrize, team_id: winner.team_id || null };
}

module.exports = {
  distributeEventPrizeWithTeams
};