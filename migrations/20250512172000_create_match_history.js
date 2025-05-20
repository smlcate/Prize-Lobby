// migrations/20250512172000_create_match_history.js

exports.up = function (knex) {
  return knex.schema.createTable('match_history', function (table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.integer('opponent_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.integer('event_id').unsigned().references('id').inTable('events').onDelete('CASCADE');
    table.integer('match_id').unsigned().references('id').inTable('bracket_matches').onDelete('CASCADE');
    table.integer('user_score');
    table.integer('opponent_score');
    table.boolean('won').defaultTo(false);
    table.timestamp('played_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('match_history');
};
