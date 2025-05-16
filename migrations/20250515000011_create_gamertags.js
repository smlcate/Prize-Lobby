
exports.up = function(knex) {
  return knex.schema.createTable('gamertags', function(table) {
    table.increments('id').primary();
    table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('platform').notNullable();
    table.string('gamertag').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('gamertags');
};
