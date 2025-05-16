
exports.up = function(knex) {
  return knex.schema.createTable('platform_settings', function(table) {
    table.increments('id').primary();
    table.integer('platform_fee_percent').notNullable().defaultTo(10);
    table.timestamps(true, true);
  }).then(() => {
    return knex('platform_settings').insert({ platform_fee_percent: 10 });
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('platform_settings');
};
