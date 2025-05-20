// migrations/20250512164000_create_bracket_matches.js

exports.up = function (knex) {
  return knex.schema.createTable('bracket_matches', function (table) {
    table.increments('id').primary();
    table.integer('event_id').unsigned().references('id').inTable('events').onDelete('CASCADE');
    table.integer('round').notNullable(); // round number
    table.integer('player1_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.integer('player2_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.integer('winner_id').unsigned().references('id').inTable('users');
    table.integer('player1_score');
    table.integer('player2_score');
    table.boolean('disputed').defaultTo(false);
    table.boolean('verified').defaultTo(false);
    table.timestamp('match_time');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('bracket_matches');
};
