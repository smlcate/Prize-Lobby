
exports.up = function(knex) {
  return knex.schema.table('challenges', function(table) {
    table.string('type').notNullable().defaultTo('1v1');
  });
};

exports.down = function(knex) {
  return knex.schema.table('challenges', function(table) {
    table.dropColumn('type');
  });
};
