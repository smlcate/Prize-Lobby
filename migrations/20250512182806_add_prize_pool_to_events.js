exports.up = function(knex) {
  return knex.schema.table('events', function(table) {
    table.integer('prize_pool').notNullable().defaultTo(0);
  });
};

exports.down = function(knex) {
  return knex.schema.table('events', function(table) {
    table.dropColumn('prize_pool');
  });
};
