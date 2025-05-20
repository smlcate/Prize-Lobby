
exports.seed = async function(knex) {
  const users = [
    {
      id: 101,
      username: 'TestUserGamertag',
      email: 'gamertag@example.com',
      password: 'hashed_pw'
    },
    {
      id: 102,
      username: 'TeamOwner',
      email: 'teamowner@example.com',
      password: 'hashed_pw'
    }
  ];

  for (const user of users) {
    const exists = await knex('users').where({ id: user.id }).first();
    if (!exists) {
      await knex('users').insert(user);
    }
  }

  const testUser = await knex('users').where({ id: 101 }).first();
  const teamOwner = await knex('users').where({ id: 102 }).first();

  const gamertag = await knex('gamertags')
    .where({ user_id: testUser.id, platform: 'psn' })
    .first();

  if (!gamertag) {
    await knex('gamertags').insert({
      user_id: testUser.id,
      platform: 'psn',
      gamertag: 'TestGamertag123'
    });
  }

  const challengeId = 9001;
  const challengeExists = await knex('challenges').where({ id: challengeId }).first();

  if (!challengeExists) {
    await knex('challenges').insert({
      id: challengeId,
      title: 'Test Completed Challenge',
      creator_id: teamOwner.id,
      game: 'rocket-league',
      platform: 'xbox',
      status: 'completed',
      prize: 1000,
      mode: '1v1'
    });

    await knex('challenge_participants').insert([
      { challenge_id: challengeId, user_id: testUser.id },
      { challenge_id: challengeId, user_id: teamOwner.id }
    ]);
  }
};
