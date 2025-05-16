
exports.up = function(knex) {
  return knex.schema.createTable('bracket_matches', function(table) {
    table.increments('id').primary();
    table.integer('event_id').notNullable().references('id').inTable('events').onDelete('CASCADE');
    table.integer('round').notNullable();
    table.integer('match_number').notNullable();
    table.integer('player1_id');
    table.integer('player2_id');
    table.integer('winner_id');
    table.string('status').defaultTo('pending');
    table.string('tracker_match_id');
    table.boolean('result_verified').defaultTo(false);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('bracket_matches');
};
