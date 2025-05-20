
exports.up = function (knex) {
  return Promise.all([
    knex.schema.alterTable('teams', function (table) {
      table.text('bio');
    }),
    knex.schema.alterTable('team_members', function (table) {
      table.dropColumn('is_captain');
      table.string('role').notNullable().defaultTo('member');
    })
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.schema.alterTable('teams', function (table) {
      table.dropColumn('bio');
    }),
    knex.schema.alterTable('team_members', function (table) {
      table.dropColumn('role');
      table.boolean('is_captain').defaultTo(false);
    })
  ]);
};
