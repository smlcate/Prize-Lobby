exports.up = function (knex) {
  return knex.schema.createTable('league_accounts', function (table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.string('summoner_name').notNullable();
    table.string('region').notNullable(); // e.g., NA1, EUW1, etc.
    table.string('riot_id');
    table.boolean('validated').defaultTo(false);
    table.timestamp('validated_at');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('league_accounts');
};
