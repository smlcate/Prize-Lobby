// test-db-connection.js
require('dotenv').config({ path: '.env.test' });
const knex = require('knex')({
  client: 'pg',
  connection: process.env.TEST_DATABASE_URL
});

knex.raw('SELECT 1+1 AS result')
  .then(() => {
    console.log('✅ DB connection successful');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1);
  });
