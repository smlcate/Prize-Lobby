
exports.up = function(knex) {
  return knex.schema.createTable('challenge_participants', function(table) {
    table.increments('id').primary();
    table.integer('challenge_id').unsigned().references('id').inTable('challenges').onDelete('CASCADE');
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.timestamps(true, true);
    table.unique(['challenge_id', 'user_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('challenge_participants');
};
