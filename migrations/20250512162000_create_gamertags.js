// migrations/20250512162000_create_gamertags.js

exports.up = function (knex) {
  return knex.schema.createTable('gamertags', function (table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.string('platform').notNullable(); // xbox, psn, steam, epic, etc.
    table.string('gamertag').notNullable();
    table.string('tracker_url'); // optional: used for Tracker.gg link
    table.boolean('validated').defaultTo(false); // Tracker.gg validation status
    table.timestamp('validated_at');
    table.unique(['user_id', 'platform']);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('gamertags');
};
