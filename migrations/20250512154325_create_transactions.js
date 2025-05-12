exports.up = function(knex) {
  return knex.schema.createTable('transactions', table => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('type').notNullable(); // deposit, entry_fee, prize, withdrawal
    table.integer('amount').notNullable(); // cents
    table.string('ref').nullable(); // eventId or Stripe PID
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('transactions');
};
