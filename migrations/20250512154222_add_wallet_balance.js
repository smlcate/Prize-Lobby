exports.up = function(knex) {
  return knex.schema.alterTable('users', table => {
    table.integer('wallet_balance').notNullable().defaultTo(0); // store cents
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('users', table => {
    table.dropColumn('wallet_balance');
  });
};
