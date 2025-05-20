// migrations/20250512173000_create_team_wallets_and_transactions.js

exports.up = function (knex) {
  return knex.schema
    .createTable('team_wallets', function (table) {
      table.increments('id').primary();
      table.integer('team_id').references('id').inTable('teams').onDelete('CASCADE').notNullable();
      table.integer('amount').notNullable();
      table.string('type').notNullable();
      table.jsonb('metadata');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('team_transactions', function (table) {
      table.increments('id').primary();
      table.integer('team_wallet_id').unsigned().references('id').inTable('team_wallets').onDelete('CASCADE');
      table.string('type').notNullable(); // deposit, prize, payout, etc.
      table.integer('amount').notNullable();
      table.jsonb('metadata');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('team_transactions')
    .dropTableIfExists('team_wallets');
};
