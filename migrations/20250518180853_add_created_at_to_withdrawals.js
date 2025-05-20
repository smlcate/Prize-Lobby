exports.up = function(knex) {
  return knex.schema.alterTable('withdrawals', table => {
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('withdrawals', table => {
    table.dropColumn('created_at');
  });
};
