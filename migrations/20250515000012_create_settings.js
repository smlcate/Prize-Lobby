
exports.up = function(knex) {
  return knex.schema.createTable('settings', function(table) {
    table.increments('id').primary();
    table.string('key').notNullable().unique();
    table.string('value');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('settings');
};
