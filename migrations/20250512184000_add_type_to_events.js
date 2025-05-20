// migrations/20250512184000_add_type_to_events.js

exports.up = function (knex) {
  return knex.schema.alterTable('events', function (table) {
    table.string('type'); // e.g., 'bracket', 'ffa', etc.
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('events', function (table) {
    table.dropColumn('type');
  });
};
