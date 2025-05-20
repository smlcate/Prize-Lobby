
exports.up = function(knex) {
  return Promise.all([
    knex.schema.hasColumn('events', 'format').then(exists => {
      if (!exists) {
        return knex.schema.table('events', table => {
          table.string('format').defaultTo('standard');
        });
      }
    }),
    knex.schema.hasColumn('events', 'prize_pool').then(exists => {
      if (!exists) {
        return knex.schema.table('events', table => {
          table.integer('prize_pool').defaultTo(0);
        });
      }
    }),
    knex.schema.hasColumn('notifications', 'is_read').then(exists => {
      if (!exists) {
        return knex.schema.table('notifications', table => {
          table.boolean('is_read').defaultTo(false);
        });
      }
    })
  ]);
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.table('events', table => {
      table.dropColumn('format');
      table.dropColumn('prize_pool');
    }),
    knex.schema.table('notifications', table => {
      table.dropColumn('is_read');
    })
  ]);
};
