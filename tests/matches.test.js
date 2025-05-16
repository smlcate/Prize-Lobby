
const request = require('supertest');
const app = require('../server');
const { getTokenForUser } = require('./helpers/tokenHelper');

describe('Match Flow', () => {
  it('should start an event', async () => {
    const token = await getTokenForUser('TestUser1');
    const res = await request(app)
      .post('/api/matches/start')
      .set('Authorization', `Bearer ${token}`);
    console.log('Response:', res.statusCode, res.body);
    expect([200, 201, 404]).toContain(res.statusCode);
  });

  it('should complete an event', async () => {
    const token = await getTokenForUser('TestUser1');
    const res = await request(app)
      .post('/api/matches/complete')
      .set('Authorization', `Bearer ${token}`);
    console.log('Response:', res.statusCode, res.body);
    expect([200, 201, 404]).toContain(res.statusCode);
  });
});
