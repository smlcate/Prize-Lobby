
exports.up = function(knex) {
  return knex.schema.createTable('withdrawals', function(table) {
    table.increments('id').primary();
    table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('amount').notNullable();
    table.string('status').notNullable().defaultTo('pending');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('withdrawals');
};
