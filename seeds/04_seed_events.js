exports.seed = async function(knex) {
  await knex('event_participants').del();
  await knex('events').del();

  await knex('events').insert([
    {
      id: 1,
      creator_id: 1,
      title: 'Rocket League Clash',
      game: 'rocketleague',
      platform: 'steam',
      mode: '1v1',
      type: 'bracket',
      status: 'open',
      start_time: new Date(),
      created_at: new Date()
    },
    {
      id: 2,
      creator_id: 2,
      title: 'Apex Showdown',
      game: 'apexlegends',
      platform: 'xbox',
      mode: 'duos',
      type: 'bracket',
      status: 'open',
      start_time: new Date(),
      created_at: new Date()
    }
  ]);
};
