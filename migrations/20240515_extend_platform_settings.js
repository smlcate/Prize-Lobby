
exports.up = function(knex) {
  return knex.schema.table('platform_settings', function(table) {
    table.integer('min_withdrawal_amount').notNullable().defaultTo(500);
    table.integer('max_event_participants').notNullable().defaultTo(64);
    table.integer('max_challenges_per_user').notNullable().defaultTo(10);
    table.integer('verification_grace_minutes').notNullable().defaultTo(5);
    table.string('support_email').notNullable().defaultTo('support@prizelobbygames.com');
  });
};

exports.down = function(knex) {
  return knex.schema.table('platform_settings', function(table) {
    table.dropColumn('min_withdrawal_amount');
    table.dropColumn('max_event_participants');
    table.dropColumn('max_challenges_per_user');
    table.dropColumn('verification_grace_minutes');
    table.dropColumn('support_email');
  });
};
