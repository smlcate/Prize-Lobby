// migrations/20250512180000_create_stripe_events.js

exports.up = function (knex) {
  return knex.schema.createTable('stripe_events', function (table) {
    table.increments('id').primary();
    table.string('event_id').notNullable().unique(); // Stripe's event ID
    table.string('type').notNullable(); // e.g., checkout.session.completed
    table.jsonb('data'); // full webhook payload
    table.timestamp('received_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('stripe_events');
};
