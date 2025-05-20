// migrations/20250512170000_create_teams_and_members.js

exports.up = function (knex) {
  return knex.schema
    .createTable('teams', function (table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.integer('creator_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('team_members', function (table) {
      table.increments('id').primary();
      table.integer('team_id').unsigned().references('id').inTable('teams').onDelete('CASCADE');
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.boolean('is_captain').defaultTo(false);
      table.timestamp('joined_at').defaultTo(knex.fn.now());
      table.unique(['team_id', 'user_id']);
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('team_members')
    .dropTableIfExists('teams');
};
