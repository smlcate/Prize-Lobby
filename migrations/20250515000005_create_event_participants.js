
exports.up = function(knex) {
  return knex.schema.createTable('event_participants', function(table) {
    table.increments('id').primary();
    table.integer('event_id').notNullable().references('id').inTable('events').onDelete('CASCADE');
    table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('gamertag');
    table.string('platform');
    table.string('tracker_match_id');
    table.timestamp('start_guess_time');
    table.boolean('result_verified').defaultTo(false);
    table.integer('score').defaultTo(0);
    table.boolean('is_winner').defaultTo(false);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('event_participants');
};
