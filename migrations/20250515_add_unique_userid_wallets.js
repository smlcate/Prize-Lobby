
exports.up = function(knex) {
  return knex.schema.alterTable('wallets', function(table) {
    table.unique('user_id');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('wallets', function(table) {
    table.dropUnique('user_id');
  });
};
