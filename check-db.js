require('dotenv').config();
const knex = require('knex')({
  client: 'pg',
  connection: process.env.PG_URI,
});

knex.raw('SELECT current_database()')
  .then(res => {
    console.log('Connected to DB:', res.rows[0].current_database);
    return knex.raw('SELECT tablename FROM pg_tables WHERE schemaname = ?', ['public']);
  })
  .then(res => {
    console.log('Tables in public schema:', res.rows.map(r => r.tablename));
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection error:', err);
    process.exit(1);
  });
