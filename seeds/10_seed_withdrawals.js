exports.seed = async function(knex) {
  await knex('withdrawals').del();

  await knex('withdrawals').insert([
    {
      user_id: 1,
      amount: 1000,
      status: 'approved',
      requested_at: new Date(),
      reviewed_at: new Date()
    },
    {
      user_id: 2,
      amount: 2000,
      status: 'pending',
      requested_at: new Date()
    }
  ]);
};
