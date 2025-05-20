
exports.seed = async function(knex) {
  await knex('gamertags').del();
  await knex('gamertags').insert([
    { user_id: 1, platform: 'epic', gamertag: 'AdminEpic' },
    { user_id: 1, platform: 'xbox', gamertag: 'AdminXbox' },
    { user_id: 2, platform: 'epic', gamertag: 'BobRL' },
    { user_id: 2, platform: 'psn', gamertag: 'BobPSN' },
    { user_id: 3, platform: 'epic', gamertag: 'SarahRocket' },
    { user_id: 3, platform: 'steam', gamertag: 'SarahSteam' }
  ]);
};
