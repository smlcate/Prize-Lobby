
exports.up = function(knex) {
  return knex.schema.table('challenges', function(table) {
    table.string('format').notNullable().defaultTo('score'); // e.g., 'score', 'elimination', etc.
  });
};

exports.down = function(knex) {
  return knex.schema.table('challenges', function(table) {
    table.dropColumn('format');
  });
};
