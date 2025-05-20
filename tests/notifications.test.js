const request = require('supertest');
const app = require('../app');

describe('🔔 NOTIFICATIONS API TESTS', () => {
  it('should load notifications route safely', async () => {
    const res = await request(app).get('/api/notifications/nonexistent');
    expect([401, 403, 404]).toContain(res.statusCode);
  });
});
