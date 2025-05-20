exports.up = function (knex) {
  return knex.schema.createTable('challenge_results', function (table) {
    table.increments('id').primary();
    table.integer('challenge_id').unsigned().references('id').inTable('challenges').onDelete('CASCADE');
    table.integer('winner_id').unsigned().references('id').inTable('users');
    table.integer('loser_id').unsigned().references('id').inTable('users');
    table.integer('winner_score');
    table.integer('loser_score');
    table.timestamp('reported_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('challenge_results');
};
