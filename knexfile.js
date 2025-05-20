require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.PG_URI,
    seeds: {
      directory: './seeds'
    }
  },
  test: {
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL,
    seeds: {
      directory: './seeds' // 👈 seed file is in project root
    }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    acquireConnectionTimeout: 10000,
    ssl: { rejectUnauthorized: false },
    seeds: {
      directory: './seeds'
    }
  }
};
