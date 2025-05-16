
exports.seed = async function(knex) {
  await knex('bracket_matches').del();
  await knex('disputes').del();
  await knex('withdrawals').del();
  await knex('transactions').del();
  await knex('challenges_participants').del();
  await knex('event_participants').del();
  await knex('challenges').del();
  await knex('events').del();
  await knex('wallets').del();
  await knex('gamertags').del();
  await knex('users').del();

  // Users
  await knex('users').insert([
    { id: 1, username: 'alice', email: 'alice@test.com', password: 'pass', is_admin: true },
    { id: 2, username: 'bob', email: 'bob@test.com', password: 'pass' },
    { id: 3, username: 'carol', email: 'carol@test.com', password: 'pass' },
    { id: 4, username: 'dan', email: 'dan@test.com', password: 'pass' },
    { id: 5, username: 'erin', email: 'erin@test.com', password: 'pass' },
    { id: 6, username: 'frank', email: 'frank@test.com', password: 'pass' },
    { id: 7, username: 'gina', email: 'gina@test.com', password: 'pass' },
    { id: 8, username: 'hank', email: 'hank@test.com', password: 'pass' }
  ]);

  // Wallets (in cents)
  await knex('wallets').insert([
    { user_id: 1, balance: 10000 },
    { user_id: 2, balance: 5000 },
    { user_id: 3, balance: 7500 },
    { user_id: 4, balance: 2000 },
    { user_id: 5, balance: 4000 },
    { user_id: 6, balance: 3000 },
    { user_id: 7, balance: 10000 },
    { user_id: 8, balance: 6000 }
  ]);

  // Gamertags
  await knex('gamertags').insert([
    { user_id: 1, platform: 'epic', gamertag: 'AliceRL' },
    { user_id: 2, platform: 'epic', gamertag: 'BobRL' },
    { user_id: 3, platform: 'epic', gamertag: 'CarolRL' },
    { user_id: 4, platform: 'epic', gamertag: 'DanRL' },
    { user_id: 5, platform: 'xbl', gamertag: 'ErinXBL' },
    { user_id: 6, platform: 'psn', gamertag: 'FrankPSN' },
    { user_id: 7, platform: 'epic', gamertag: 'GinaRL' },
    { user_id: 8, platform: 'epic', gamertag: 'HankRL' }
  ]);

  // Transactions
  await knex('transactions').insert([
    { user_id: 1, type: 'deposit', amount: 10000 },
    { user_id: 2, type: 'deposit', amount: 5000 },
    { user_id: 3, type: 'deposit', amount: 7500 },
    { user_id: 4, type: 'deposit', amount: 2000 },
    { user_id: 5, type: 'deposit', amount: 4000 },
    { user_id: 6, type: 'deposit', amount: 3000 },
    { user_id: 7, type: 'deposit', amount: 10000 },
    { user_id: 8, type: 'deposit', amount: 6000 },
    { user_id: 1, type: 'entry_fee', amount: 500 },
    { user_id: 2, type: 'entry_fee', amount: 500 },
    { user_id: 1, type: 'prize', amount: 900 },
    { user_id: 2, type: 'refund', amount: 100 }
  ]);

  // Challenges
  await knex('challenges').insert([
    {
      id: 1, creator_id: 1, title: '1v1 Live Match', game: 'rocketleague', platform: 'epic',
      format: '1v1', entry_fee: 500, status: 'in_progress'
    },
    {
      id: 2, creator_id: 3, title: '1v1 Complete Match', game: 'rocketleague', platform: 'epic',
      format: '1v1', entry_fee: 500, status: 'completed', winner_id: 1
    },
    {
      id: 3, creator_id: 4, title: '1v1 Canceled Match', game: 'rocketleague', platform: 'epic',
      format: '1v1', entry_fee: 500, status: 'canceled'
    }
  ]);

  // Challenge Participants
  await knex('challenges_participants').insert([
    { challenge_id: 1, user_id: 1 },
    { challenge_id: 1, user_id: 2 },
    { challenge_id: 2, user_id: 1 },
    { challenge_id: 2, user_id: 3 },
    { challenge_id: 3, user_id: 4 },
    { challenge_id: 3, user_id: 5 }
  ]);

  // Events
  await knex('events').insert([
    {
      id: 1, creator_id: 6, title: '8-Player Bracket', game: 'rocketleague', platform: 'epic',
      type: 'tournament', format: '1v1', entry_fee: 500, prize_pool: 4000,
      status: 'started', verified: false
    }
  ]);

  // Event Participants
  await knex('event_participants').insert([
    { event_id: 1, user_id: 1 },
    { event_id: 1, user_id: 2 },
    { event_id: 1, user_id: 3 },
    { event_id: 1, user_id: 4 },
    { event_id: 1, user_id: 5 },
    { event_id: 1, user_id: 6 },
    { event_id: 1, user_id: 7 },
    { event_id: 1, user_id: 8 }
  ]);

  // Bracket Matches (just round 1 shown for brevity)
  await knex('bracket_matches').insert([
    { event_id: 1, round: 1, match_number: 0, player1_id: 1, player2_id: 2, status: 'completed', winner_id: 1 },
    { event_id: 1, round: 1, match_number: 1, player1_id: 3, player2_id: 4, status: 'completed', winner_id: 4 },
    { event_id: 1, round: 1, match_number: 2, player1_id: 5, player2_id: 6, status: 'pending' },
    { event_id: 1, round: 1, match_number: 3, player1_id: 7, player2_id: 8, status: 'pending' }
  ]);

  // Withdrawals
  await knex('withdrawals').insert([
    { user_id: 2, amount: 2500, status: 'pending' },
    { user_id: 3, amount: 1500, status: 'approved' }
  ]);

  // Disputes
  await knex('disputes').insert([
    { match_id: 1, challenge_id: 1, event_id: null, reporter_id: 2, reason: 'Score mismatch' }
  ]);
};
