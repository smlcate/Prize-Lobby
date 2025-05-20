
exports.seed = async function(knex) {
  // Insert TestUser2 if missing
  const testUser2 = await knex('users').where({ id: 2 }).first();
  if (!testUser2) {
    await knex('users').insert({
      id: 2,
      username: 'TestUser2',
      email: 'testuser2@example.com',
      password: 'hashed_pw'
    });
  }

  // Insert NotifyUser if missing
  const notifyUser = await knex('users').where({ id: 3 }).first();
  if (!notifyUser) {
    await knex('users').insert({
      id: 3,
      username: 'NotifyUser',
      email: 'notify@example.com',
      password: 'hashed_pw'
    });
  }

  // Insert testMatch with status 'pending' for cron.test.js
  const testMatch = await knex('bracket_matches').where({ id: 1 }).first();
  if (!testMatch) {
    await knex('bracket_matches').insert({
      id: 1,
      event_id: 1,
      player1_id: 2,
      player2_id: 3,
      status: 'pending',
      round: 1
    });
  }

  // Insert a match with 'open' status for dispute rejection test
  const openMatch = await knex('bracket_matches').where({ id: 999 }).first();
  if (!openMatch) {
    await knex('bracket_matches').insert({
      id: 999,
      event_id: 1,
      player1_id: 2,
      player2_id: 3,
      status: 'open',
      round: 1
    });
  }
};
