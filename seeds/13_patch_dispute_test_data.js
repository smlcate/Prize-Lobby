
exports.seed = async function(knex) {
  // Ensure challenge 1 is completed
  await knex('challenges')
    .where({ id: 1 })
    .update({ status: 'completed' });

  // Ensure TestUser2 is a participant in challenge 1
  const exists = await knex('challenge_participants')
    .where({ challenge_id: 1, user_id: 2 })
    .first();

  if (!exists) {
    await knex('challenge_participants').insert({
      challenge_id: 1,
      user_id: 2
    });
  }

  // Delete any existing disputes on match_id = 1 from user_id = 2
  await knex('disputes')
    .where({ match_id: 1, user_id: 2 })
    .del();
};
