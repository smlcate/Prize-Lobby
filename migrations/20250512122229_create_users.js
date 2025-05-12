exports.up = function(knex) {
  return knex.schema
    .createTable('users', function(table) {
      table.increments('id').primary();
      table.string('username').notNullable();
      table.string('email').unique().notNullable();
      table.string('password').notNullable();
      table.timestamps(true, true); // created_at, updated_at
    })
    .createTable('gamertags', function(table) {
      table.increments('id').primary();
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table.string('platform').notNullable();  // e.g., 'xbox', 'psn', 'steam'
      table.string('gamertag').notNullable();
      table.unique(['user_id', 'platform']);   // enforce 1 tag per platform per user
      table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('gamertags')
    .dropTableIfExists('users');
};
