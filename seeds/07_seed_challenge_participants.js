
exports.seed = async function(knex) {
  await knex('challenge_participants').del();
  await knex('challenge_participants').insert([
    { challenge_id: 2, user_id: 2 },
    { challenge_id: 2, user_id: 3 }
  ]);
};
