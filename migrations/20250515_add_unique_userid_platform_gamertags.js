
exports.up = function(knex) {
  return knex.schema.alterTable('gamertags', function(table) {
    table.unique(['user_id', 'platform']);
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('gamertags', function(table) {
    table.dropUnique(['user_id', 'platform']);
  });
};
