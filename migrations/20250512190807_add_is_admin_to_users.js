exports.up = function(knex) {
  return knex.schema.table('users', function(table) {
    table.boolean('is_admin').notNullable().defaultTo(false);
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('is_admin');
  });
};
