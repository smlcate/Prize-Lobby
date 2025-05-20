exports.up = function (knex) {
  return knex.schema.createTable('withdrawal_requests', function (table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.integer('amount').notNullable();
    table.string('status').defaultTo('pending'); // pending, approved, rejected
    table.timestamp('requested_at').defaultTo(knex.fn.now());
    table.timestamp('processed_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('withdrawal_requests');
};
