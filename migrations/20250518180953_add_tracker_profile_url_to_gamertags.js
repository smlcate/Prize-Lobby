exports.up = function(knex) {
  return knex.schema.alterTable('gamertags', table => {
    table.string('tracker_profile_url').defaultTo(null);
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('gamertags', table => {
    table.dropColumn('tracker_profile_url');
  });
};
