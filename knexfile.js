require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.PG_URI, // ← from your .env file
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }
};
