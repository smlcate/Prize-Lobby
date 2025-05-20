const request = require('supertest');
const app = require('../app');

describe('⚖️ DISPUTE API TESTS', () => {
  it('should load dispute routes', async () => {
    const res = await request(app).get('/api/disputes/nonexistent');
    expect([401, 403, 404]).toContain(res.statusCode);
  });
});
