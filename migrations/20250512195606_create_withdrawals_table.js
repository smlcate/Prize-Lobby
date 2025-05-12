exports.up = function(knex) {
  return knex.schema.createTable('withdrawals', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('amount').notNullable();
    table.string('status').defaultTo('pending'); // pending, approved, rejected
    table.string('method'); // e.g. PayPal, Bank
    table.string('details'); // destination info
    table.timestamp('requested_at').defaultTo(knex.fn.now());
    table.timestamp('processed_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('withdrawals');
};
