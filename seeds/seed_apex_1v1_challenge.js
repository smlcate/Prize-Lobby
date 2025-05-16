exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('challenge_participants').del();
  await knex('challenges').del();

  // Inserts seed entries
  const [challengeId] = await knex('challenges').insert({
    creator_id: 1,
    entry_fee: 500,
    game: 'apex_legends',
    platform: 'origin',
    prize: 1000,
    status: 'open',
    title: 'Test Apex 1v1',
    type: 'challenge',
    format: 'score'
  }).returning('id');

  await knex('challenge_participants').insert([
    { challenge_id: challengeId.id || challengeId, user_id: 1 },
    { challenge_id: challengeId.id || challengeId, user_id: 2 }
  ]);
};
