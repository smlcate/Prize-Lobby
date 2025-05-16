require('dotenv').config({ path: '.env.test' }); // Load test environment
const knex = require('./models/db');
const seedTestData = require('./seeds/test_seed');

beforeAll(async () => {
  console.log('📦 Running test database seed...');
  process.env.NODE_ENV = 'test';
  await seedTestData();
});

afterAll(async () => {
  console.log('🧹 Closing test DB connection...');
  await knex.destroy();
});
