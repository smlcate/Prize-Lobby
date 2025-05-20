// migrations/20250512160000_create_transactions.js

exports.up = function (knex) {
  return knex.schema.createTable('transactions', function (table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.string('type').notNullable(); // deposit, withdrawal, entry_fee, prize, refund
    table.integer('amount').notNullable(); // stored in cents
    table.jsonb('metadata'); // optional JSON metadata
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('transactions');
};
