exports.up = function(knex) {
  return knex.schema.createTable('disputes', function(table) {
    table.increments('id').primary();
    table.integer('challenge_id').references('id').inTable('challenges').onDelete('CASCADE');
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.text('reason').notNullable();
    table.text('admin_comment');
    table.enu('status', ['open', 'resolved', 'rejected']).defaultTo('open');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('disputes');
};