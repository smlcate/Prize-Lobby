// migrations/20240516_add_prize_to_challenges.js

exports.up = function (knex) {
  return knex.schema.alterTable('challenges', function (table) {
    table.integer('prize').notNullable().defaultTo(0); // prize stored in cents
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('challenges', function (table) {
    table.dropColumn('prize');
  });
};
