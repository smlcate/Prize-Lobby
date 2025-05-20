exports.seed = async function(knex) {
  await knex('bracket_matches').del();

  await knex('bracket_matches').insert([
    {
      id: 1,
      event_id: 1,
      round: 1,
      match_number: 1,
      player1_id: 1,
      player2_id: 2,
      winner_id: 1,
      result_submitted: true,
      result_verified: true,
      match_time: new Date(),
      created_at: new Date(),
      game: 'rocket-league'
    },
    {
      id: 2,
      event_id: 1,
      round: 2,
      match_number: 2,
      player1_id: 1,
      player2_id: null,
      winner_id: 1,
      result_submitted: true,
      result_verified: true,
      match_time: new Date(),
      created_at: new Date(),
      game: 'rocket-league'
    }
  ]);
};
