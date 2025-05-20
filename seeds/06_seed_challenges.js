exports.seed = async function(knex) {
  await knex('challenge_participants').del();
  await knex('challenges').del();

  await knex('challenges').insert([
    {
      id: 1,
      creator_id: 1,
      title: '1v1 Rocket League',
      game: 'rocketleague',
      platform: 'steam',
      mode: '1v1',
      format: 'single',
      status: 'open',
      prize: 500,
      created_at: new Date()
    },
    {
      id: 2,
      creator_id: 2,
      title: 'FFA Apex Arena',
      game: 'apexlegends',
      platform: 'xbox',
      mode: 'ffa',
      format: 'elimination',
      status: 'open',
      prize: 1000,
      created_at: new Date()
    }
  ]);
};
