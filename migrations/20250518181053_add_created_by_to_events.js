exports.up = function(knex) {
  return knex.schema.alterTable('events', table => {
    table.integer('created_by').references('users.id').onDelete('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('events', table => {
    table.dropColumn('created_by');
  });
};
