exports.seed = async function(knex) {
  console.log("🌱 Seeding test users and cron match data");

  // Clear related tables in proper order
  await knex('notifications').del();
  await knex('withdrawals').del();
  await knex('transactions').del();
  await knex('bracket_matches').del();
  await knex('challenges').del();
  await knex('events').del();
  await knex('gamertags').del();
  await knex('users').del();

  const now = new Date().toISOString();

  await knex('users').insert([
    {
      id: 1,
      username: 'AdminUser',
      email: 'admin@prizelobby.com',
      password: 'adminpass',
      is_admin: true,
      created_at: now
    },
    {
      id: 2,
      username: 'TestUser2',
      email: 'test2@prizelobby.com',
      password: 'password',
      is_admin: false,
      created_at: now
    },
    {
      id: 3,
      username: 'NotifyUser',
      email: 'notify@prizelobby.com',
      password: 'password',
      is_admin: false,
      created_at: now
    },
    {
      id: 5,
      username: 'WalletUser',
      email: 'wallet@prizelobby.com',
      password: 'password',
      is_admin: false,
      created_at: now
    },
    {
      id: 7,
      username: 'WrongUser',
      email: 'wrong@prizelobby.com',
      password: 'password',
      is_admin: false,
      created_at: now
    },
    {
      id: 101,
      username: 'GamerOne',
      email: 'gamer1@prizelobby.com',
      password: 'password',
      is_admin: false,
      created_at: now
    },
    {
      id: 102,
      username: 'GamerTwo',
      email: 'gamer2@prizelobby.com',
      password: 'password',
      is_admin: false,
      created_at: now
    }
  ]);

  await knex('gamertags').insert([
    {
      user_id: 101,
      platform: 'steam',
      gamertag: 'RocketGod123',
      tracker_profile_url: 'https://rocketleague.tracker.network/rocket-league/profile/steam/RocketGod123',
      validated: false,
      created_at: now
    }
  ]);

  await knex('transactions').insert([
    { user_id: 2, type: 'deposit', amount: 5000, created_at: now },
    { user_id: 3, type: 'deposit', amount: 8000, created_at: now },
    { user_id: 2, type: 'fee', amount: -500, created_at: now },
    { user_id: 3, type: 'fee', amount: -1000, created_at: now }
  ]);

  await knex('bracket_matches').insert([
    {
      id: 1,
      game: 'apex',
      player1_id: 101,
      player2_id: 102,
      status: 'pending',
      tracker_match_id: 'mock_apex_1v1',
      created_at: now,
      updated_at: now
    }
  ]);
};
