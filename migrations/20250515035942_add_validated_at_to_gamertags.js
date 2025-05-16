exports.up = function(knex) {
  return knex.schema.alterTable('gamertags', function(table) {
    table.timestamp('validated_at');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('gamertags', function(table) {
    table.dropColumn('validated_at');
  });
};
