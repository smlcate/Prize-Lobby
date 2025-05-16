
exports.up = function(knex) {
  return Promise.all([
    knex.schema.alterTable('bracket_matches', function(table) {
      table.timestamp('start_time').nullable();
    }),
    knex.schema.alterTable('challenges', function(table) {
      table.timestamp('start_time').nullable();
    })
  ]);
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.alterTable('bracket_matches', function(table) {
      table.dropColumn('start_time');
    }),
    knex.schema.alterTable('challenges', function(table) {
      table.dropColumn('start_time');
    })
  ]);
};
