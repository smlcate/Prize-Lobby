
exports.seed = async function(knex) {
  await knex('event_participants').del();
  await knex('event_participants').insert([
    { id: 1, event_id: 1, user_id: 2 },
    { id: 2, event_id: 1, user_id: 3 },
    { id: 3, event_id: 2, user_id: 3 }
  ]);
};
