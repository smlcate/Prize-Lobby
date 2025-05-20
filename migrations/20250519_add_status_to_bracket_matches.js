exports.up = function(knex) {
  return knex.schema.table('bracket_matches', function(table) {
    table.string('status').notNullable().defaultTo('pending');
  });
};

exports.down = function(knex) {
  return knex.schema.table('bracket_matches', function(table) {
    table.dropColumn('status');
  });
};
