// migrations/20250512185000_add_format_to_challenges.js

exports.up = function (knex) {
  return knex.schema.alterTable('challenges', function (table) {
    table.string('format'); // e.g., '1v1', 'ffa', etc.
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('challenges', function (table) {
    table.dropColumn('format');
  });
};
