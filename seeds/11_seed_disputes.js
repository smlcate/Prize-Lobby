exports.seed = async function(knex) {
  await knex('disputes').del();

  await knex('disputes').insert([
    {
      match_id: 1,
      user_id: 2,
      reason: 'Opponent entered the wrong score.',
      status: 'open',
      created_at: new Date()
    },
    {
      match_id: 1,
      user_id: 1,
      reason: 'Lag caused a disconnect.',
      status: 'resolved',
      created_at: new Date(),
      resolved_at: new Date(),
      admin_resolution: 'Match replay granted.'
    }
  ]);
};
