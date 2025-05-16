exports.up = function(knex) {
  return knex.schema.alterTable('gamertags', function(table) {
    table.string('tracker_profile_url');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('gamertags', function(table) {
    table.dropColumn('tracker_profile_url');
  });
};
