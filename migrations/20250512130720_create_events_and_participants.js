exports.up = function(knex) {
  return knex.schema
    .createTable('events', table => {
      table.increments('id').primary();
      table
        .integer('creator_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table.string('title').notNullable();
      table.string('type').notNullable(); // 'event' or 'challenge'
      table.string('game').notNullable();
      table.string('format').notNullable(); // '1v1', 'team', etc.
      table.string('platform').notNullable(); // 'xbox', 'psn', 'steam', 'crossplay'
      table.integer('entry_fee').notNullable();
      table.integer('max_players').notNullable();
      table.text('rules').nullable();
      table.string('status').defaultTo('pending'); // pending, open, started, completed
      table.timestamps(true, true);
    })
    .createTable('event_participants', table => {
      table.increments('id').primary();
      table
        .integer('event_id')
        .unsigned()
        .references('id')
        .inTable('events')
        .onDelete('CASCADE');
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table.string('gamertag').notNullable();
      table.string('platform').notNullable();
      table.string('result').nullable(); // win, loss, pending
      table.unique(['event_id', 'user_id']);
      table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('event_participants')
    .dropTableIfExists('events');
};
