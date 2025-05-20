exports.up = function (knex) {
  return knex.schema.alterTable('bracket_matches', function (table) {
    table.string('game').notNullable().defaultTo('rocket-league');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('bracket_matches', function (table) {
    table.dropColumn('game');
  });
};
