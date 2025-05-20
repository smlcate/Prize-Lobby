exports.seed = async function(knex) {
  await knex('users').insert({
    id: 999,
    email: 'WrongUser',
    username: 'wronguser',
    password: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f',
    created_at: '2025-05-20T01:35:14.000Z'
  }).onConflict('id').ignore();
};
