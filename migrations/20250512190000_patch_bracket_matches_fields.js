// migrations/20250512190000_patch_bracket_matches_fields.js

exports.up = function (knex) {
  return knex.schema.alterTable('bracket_matches', function (table) {
    table.integer('match_number'); // used to track position in the bracket
    table.boolean('result_submitted').defaultTo(false);
    table.boolean('result_verified').defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('bracket_matches', function (table) {
    table.dropColumn('match_number');
    table.dropColumn('result_submitted');
    table.dropColumn('result_verified');
  });
};
