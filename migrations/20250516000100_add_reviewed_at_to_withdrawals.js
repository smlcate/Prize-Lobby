exports.up = function(knex) {
  return knex.schema.alterTable('withdrawals', function(table) {
    table.timestamp('reviewed_at').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('withdrawals', function(table) {
    table.dropColumn('reviewed_at');
  });
};
