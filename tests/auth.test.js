
const request = require('supertest');
const app = require('../server');

describe('Authentication Routes', () => {
  it('should return 401 or 403 for missing token', async () => {
    const res = await request(app).get('/api/events');
    console.log('Response:', res.statusCode, res.body);
    expect([401, 403]).toContain(res.statusCode);
  });
});
