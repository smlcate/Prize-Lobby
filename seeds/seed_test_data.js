exports.seed = async function(knex) {
  // Clear existing data in reverse dependency order
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
    { id: 1, username: 'alice', email: 'alice@test.com', password: 'hashedpass1', is_admin: true },
    { id: 2, username: 'bob', email: 'bob@test.com', password: 'hashedpass2' },
    { id: 3, username: 'carol', email: 'carol@test.com', password: 'hashedpass3' },
    { id: 4, username: 'dan', email: 'dan@test.com', password: 'hashedpass4' }
  ]);

  // Wallets
  await knex('wallets').insert([
    { user_id: 1, balance: 100.00 },
    { user_id: 2, balance: 50.00 },
    { user_id: 3, balance: 75.00 },
    { user_id: 4, balance: 20.00 }
  ]);

  // Gamertags
  await knex('gamertags').insert([
    { user_id: 1, platform: 'epic', gamertag: 'AliceRL' },
    { user_id: 2, platform: 'epic', gamertag: 'BobRL' },
    { user_id: 3, platform: 'epic', gamertag: 'CarolRL' },
    { user_id: 4, platform: 'epic', gamertag: 'DanRL' }
  ]);

  // Transactions
  await knex('transactions').insert([
    { user_id: 1, type: 'deposit', amount: 100.00, description: 'Test deposit' },
    { user_id: 2, type: 'deposit', amount: 50.00, description: 'Test deposit' },
    { user_id: 3, type: 'deposit', amount: 75.00, description: 'Test deposit' },
    { user_id: 4, type: 'deposit', amount: 20.00, description: 'Test deposit' }
  ]);

  // Challenges
  await knex('challenges').insert([
    { id: 1, creator_id: 1, title: '1v1 RL Match', game: 'rocketleague', entry_fee: 5.00, platform: 'epic', status: 'in_progress' }
  ]);

  // Challenge Participants
  await knex('challenges_participants').insert([
    { challenge_id: 1, user_id: 1 },
    { challenge_id: 1, user_id: 2 }
  ]);

  // Events
  await knex('events').insert([
    { id: 1, creator_id: 3, title: '4-player RL Bracket', game: 'rocketleague', entry_fee: 5.00, max_participants: 4, platform: 'epic', status: 'started' }
  ]);

  // Event Participants
  await knex('event_participants').insert([
    { event_id: 1, user_id: 1 },
    { event_id: 1, user_id: 2 },
    { event_id: 1, user_id: 3 },
    { event_id: 1, user_id: 4 }
  ]);

  // Bracket Matches (round 1)
  await knex('bracket_matches').insert([
    { event_id: 1, round: 1, match_index: 0, player1_id: 1, player2_id: 2, status: 'pending' },
    { event_id: 1, round: 1, match_index: 1, player1_id: 3, player2_id: 4, status: 'pending' }
  ]);
};
