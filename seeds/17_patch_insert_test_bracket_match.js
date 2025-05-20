
exports.seed = async function(knex) {
  const exists = await knex('bracket_matches').where({ id: 9001 }).first();

  if (!exists) {
    await knex('bracket_matches').insert({
      id: 9001,
      event_id: 1,
      match_number: 1,
      round: 1,
      player1_id: 101,
      player2_id: 102,
      winner_id: null,
      status: 'completed',
      created_at: new Date()
    });
  }
};
