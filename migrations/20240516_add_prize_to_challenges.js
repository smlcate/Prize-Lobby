
exports.up = function(knex) {
  return knex.schema.table('challenges', function(table) {
    table.integer('prize').notNullable().defaultTo(0); // amount in cents
  });
};

exports.down = function(knex) {
  return knex.schema.table('challenges', function(table) {
    table.dropColumn('prize');
  });
};
