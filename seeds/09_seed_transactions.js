
exports.seed = async function(knex) {
  await knex('transactions').del();
  await knex('transactions').insert([
    { user_id: 2, amount: 5000, type: 'deposit' },
    { user_id: 3, amount: 8000, type: 'deposit' },
    { user_id: 2, amount: -500, type: 'fee' },
    { user_id: 3, amount: -1000, type: 'fee' }
  ]);
};
