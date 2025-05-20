// migrations/20250512163000_create_notifications.js

exports.up = function (knex) {
  return knex.schema.createTable('notifications', function (table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.string('type').notNullable(); // match_start, result_posted, reminder, etc.
    table.string('message').notNullable();
    table.boolean('read').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('notifications');
};
