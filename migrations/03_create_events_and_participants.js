exports.up = function (knex) {
  return knex.schema
    .createTable('events', function (table) {
      table.increments('id').primary();
      table.integer('creator_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.string('title').notNullable();
      table.string('game').notNullable();
      table.string('platform').notNullable();
      table.string('mode').notNullable();
      table.string('status').defaultTo('open');
      table.timestamp('start_time');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('event_participants', function (table) {
      table.increments('id').primary();
      table.integer('event_id').unsigned().references('id').inTable('events').onDelete('CASCADE');
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.integer('score').defaultTo(0);
      table.boolean('verified').defaultTo(false);
      table.boolean('disputed').defaultTo(false);
      table.timestamp('joined_at').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('event_participants')
    .dropTableIfExists('events');
};
