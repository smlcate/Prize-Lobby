
exports.seed = async function(knex) {
  await knex('wallets').del();
  await knex('wallets').insert([
    { id: 1, user_id: 1, balance: 10000 },
    { id: 2, user_id: 2, balance: 5000 },
    { id: 3, user_id: 3, balance: 8000 }
  ]);
};
