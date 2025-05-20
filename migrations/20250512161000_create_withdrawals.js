// migrations/20250512161000_create_withdrawals.js

exports.up = function (knex) {
  return knex.schema.createTable('withdrawals', function (table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.integer('amount').notNullable(); // stored in cents
    table.string('status').notNullable().defaultTo('pending'); // pending, approved, denied
    table.timestamp('requested_at').defaultTo(knex.fn.now());
    table.timestamp('reviewed_at');
    table.text('admin_note');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('withdrawals');
};
