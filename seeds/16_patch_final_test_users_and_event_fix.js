
exports.seed = async function(knex) {
  // Add testuser2@example.com safely
  const testUserEmail = 'testuser2@example.com';
  const existingByEmail = await knex('users').where({ email: testUserEmail }).first();
  const existingById = await knex('users').where({ id: 999 }).first();

  if (!existingByEmail && !existingById) {
    await knex('users').insert({
      id: 999,
      username: 'TestUser2Alias',
      email: testUserEmail,
      password: 'hashed_pw'
    });
  }

  // Add WrongUser safely
  const wrongUserEmail = 'WrongUser';
  const existingWrong = await knex('users').where({ email: wrongUserEmail }).first();
  const existingWrongId = await knex('users').where({ id: 4 }).first();

  if (!existingWrong && !existingWrongId) {
    await knex('users').insert({
      id: 4,
      username: 'WrongUser',
      email: wrongUserEmail,
      password: 'hashed_pw'
    });
  }
};
