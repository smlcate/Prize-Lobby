
const request = require('supertest');
const app = require('../server');
const { getTokenForUser } = require('./helpers/tokenHelper');

describe('Events Routes', () => {
  it('should block event creation without token', async () => {
    const res = await request(app).post('/api/events')
      .send({ title: 'New Event', game: 'Halo', platform: 'PC' });
    console.log('Response:', res.statusCode, res.body);
    expect([401, 403]).toContain(res.statusCode);
  });

  it('should allow event creation with token', async () => {
    const token = await getTokenForUser('TestUser1');
    const res = await request(app).post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Authorized Event',
        game: 'Halo',
        platform: 'PC',
        entry_fee: 100,
        prize_pool: 200,
        format: 'single_elim',
        max_players: 8,
        type: 'challenge'
      });
    console.log('Response:', res.statusCode, res.body);
    expect([200, 201]).toContain(res.statusCode);
  });
});
