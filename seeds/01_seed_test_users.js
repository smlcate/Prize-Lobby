const bcrypt = require('bcryptjs');

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('team_transactions').del().catch(() => {});
  await knex('teams').del().catch(() => {});
  await knex('users').del();

  const users = [
    { id: 1, username: 'TestUser1', email: 'testuser1@example.com', password: await bcrypt.hash('password1', 10), is_admin: true },
    { id: 2, username: 'TestUser2', email: 'testuser2@example.com', password: await bcrypt.hash('password2', 10), is_admin: false },
    { id: 3, username: 'NotifyUser', email: 'notify@example.com', password: await bcrypt.hash('notify123', 10), is_admin: false },
    { id: 4, username: 'DisputeUser', email: 'dispute@example.com', password: await bcrypt.hash('dispute123', 10), is_admin: false },
    { id: 5, username: 'WalletUser', email: 'wallet@example.com', password: await bcrypt.hash('wallet123', 10), is_admin: false },
    { id: 6, username: 'GamertagUser', email: 'gamertag@example.com', password: await bcrypt.hash('gamertag123', 10), is_admin: false },
    { id: 7, username: 'TeamMember', email: 'team@example.com', password: await bcrypt.hash('team123', 10), is_admin: false },
    { id: 8, username: 'OtherUser', email: 'other@example.com', password: await bcrypt.hash('other123', 10), is_admin: false }
  ];

  await knex('users').insert(users);
};
