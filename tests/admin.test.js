
const request = require('supertest');
const app = require('../server');
const { getTokenForUser } = require('./helpers/tokenHelper');

describe('Admin Routes', () => {
  it('should block access to admin routes with non-admin token', async () => {
    const token = await getTokenForUser('TestUser2');
    const res = await request(app)
      .get('/api/admin/transactions')
      .set('Authorization', `Bearer ${token}`);
    console.log('Response:', res.statusCode, res.body);
    expect(res.statusCode).toBe(403);
  });

  it('should allow access with admin token', async () => {
    const token = await getTokenForUser('TestUser1');
    const res = await request(app)
      .get('/api/admin/transactions')
      .set('Authorization', `Bearer ${token}`);
    console.log('Response:', res.statusCode, res.body);
    expect([200, 404, 500]).toContain(res.statusCode);
  });
});
