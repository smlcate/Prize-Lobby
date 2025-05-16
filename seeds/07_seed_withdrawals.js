exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('withdrawals').del();

  await knex('withdrawals').insert([
    {
      id: 1,
      user_id: 1,
      amount: 5000,
      method: 'paypal',
      details: 'user1@example.com',
      status: 'pending',
      requested_at: knex.fn.now()
    },
    {
      id: 2,
      user_id: 2,
      amount: 10000,
      method: 'venmo',
      details: '@user2',
      status: 'pending',
      requested_at: knex.fn.now()
    },
    {
      id: 3,
      user_id: 1,
      amount: 2000,
      method: 'paypal',
      details: 'user1@example.com',
      status: 'approved',
      requested_at: knex.fn.now()
    }
  ]);
};