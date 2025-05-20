// migrations/20250512174000_create_settings.js

exports.up = function (knex) {
  return knex.schema.createTable('settings', function (table) {
    table.increments('id').primary();
    table.string('key').notNullable().unique();
    table.string('value').notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('settings');
};
