
const request = require('supertest');
const app = require('../app');
const db = require('../models/db');
const { getTokenForUser } = require('./helpers');

describe('Events Routes', () => {
  let token;

  beforeAll(async () => {
    token = await getTokenForUser('TestUser2');
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('should allow event creation with token', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Event',
      mode: 'standard',
        game: 'rocketleague',
        platform: 'steam',
        mode: '1v1',
        start_time: new Date(Date.now() + 3600000).toISOString()
      });

    console.log('Response:', res.statusCode, res.body);
    expect([200, 201]).toContain(res.statusCode);
  });
});
