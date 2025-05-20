// migrations/20250512171000_create_leaderboard.js

exports.up = function (knex) {
  return knex.schema.createTable('leaderboard', function (table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.integer('wins').notNullable().defaultTo(0);
    table.integer('losses').notNullable().defaultTo(0);
    table.integer('score').notNullable().defaultTo(0); // total score or points
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.unique(['user_id']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('leaderboard');
};
