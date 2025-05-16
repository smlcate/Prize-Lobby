
exports.up = function(knex) {
  return knex.schema.createTable('challenges', function(table) {
    table.increments('id').primary();
    table.integer('creator_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('title').notNullable();
    table.string('game').notNullable();
    table.string('platform').notNullable();
    table.string('format').notNullable();
    table.string('status').notNullable().defaultTo('pending');
    table.integer('entry_fee').notNullable().defaultTo(0);
    table.integer('prize_pool').notNullable().defaultTo(0);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('challenges');
};
