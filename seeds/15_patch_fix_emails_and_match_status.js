
exports.seed = async function(knex) {
  // Fix NotifyUser email
  await knex('users')
    .where({ id: 3 })
    .update({ email: 'NotifyUser' });

  // Fix TestUser2 email
  await knex('users')
    .where({ id: 2 })
    .update({ email: 'TestUser2' });

  // Set testMatch to 'completed' so dispute can be filed
  await knex('bracket_matches')
    .where({ id: 1 })
    .update({ status: 'completed' });

  // Ensure rejection case match still exists and is 'open'
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
