// migrations/20250512175000_create_platform_settings.js

exports.up = function (knex) {
  return knex.schema.createTable('platform_settings', function (table) {
    table.increments('id').primary();
    table.string('platform').notNullable(); // xbox, psn, steam, etc.
    table.decimal('platform_fee', 5, 2).notNullable().defaultTo(0.00); // % fee
    table.boolean('enabled').defaultTo(true);
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.unique(['platform']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('platform_settings');
};
