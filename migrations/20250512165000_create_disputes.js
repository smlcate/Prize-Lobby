// migrations/20250512165000_create_disputes.js

exports.up = function (knex) {
  return knex.schema.createTable('disputes', function (table) {
    table.increments('id').primary();
    table.integer('match_id').unsigned().references('id').inTable('bracket_matches').onDelete('CASCADE');
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.text('reason').notNullable();
    table.string('status').defaultTo('open'); // open, resolved, rejected
    table.text('admin_resolution');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('resolved_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('disputes');
};
