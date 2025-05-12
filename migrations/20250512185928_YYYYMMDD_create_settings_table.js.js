exports.up = function(knex) {
  return knex.schema.createTable('settings', function(table) {
    table.string('key').primary();
    table.string('value').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('settings');
};
