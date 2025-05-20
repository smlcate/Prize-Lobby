require('dotenv').config({ path: '.env.test' }); // Load test environment
const knex = require('./models/db');
const seedTestData = require('./seeds/test_seed');

beforeAll(async () => {
  console.log('📦 Running migrations...');
  process.env.NODE_ENV = 'test';
  await knex.migrate.rollback(undefined, true); // Clean test DB
  await knex.migrate.latest();                  // Run all migrations
  console.log('🌱 Seeding test data...');
  await seedTestData();                         // Seed test data
});

afterAll(async () => {
  console.log('🧹 Closing test DB connection...');
  await knex.destroy();
});
