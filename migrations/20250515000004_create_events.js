
exports.up = function(knex) {
  return knex.schema.createTable('events', function(table) {
    table.increments('id').primary();
    table.integer('creator_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('title').notNullable();
    table.string('game').notNullable();
    table.string('platform').notNullable();
    table.string('type').notNullable();
    table.string('format').notNullable();
    table.integer('entry_fee').notNullable().defaultTo(0);
    table.integer('prize_pool').notNullable().defaultTo(0);
    table.string('status').notNullable().defaultTo('pending');
    table.boolean('verified').notNullable().defaultTo(false);
    table.timestamp('started_at');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('events');
};
