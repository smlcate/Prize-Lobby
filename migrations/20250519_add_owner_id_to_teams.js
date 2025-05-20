
exports.up = function(knex) {
  return knex.schema.table('teams', function(table) {
    table.integer('owner_id').references('id').inTable('users');
  });
};

exports.down = function(knex) {
  return knex.schema.table('teams', function(table) {
    table.dropColumn('owner_id');
  });
};
