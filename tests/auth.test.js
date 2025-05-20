
const request = require('supertest');
const app = require('../app');
const db = require('../models/db');
const jwt = require('jsonwebtoken');

let validToken;
let user;

beforeAll(async () => {
  await db.seed.run();

  const res = await db('users').where({ username: 'TestUser1' }).first();
  user = res;

  validToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
});

describe('🔐 AUTH API TESTS', () => {
  test('should login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'TestUser1', password: 'password123' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('should reject login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'TestUser1', password: 'wrongpass' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  test('should return user from /me with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('username', 'TestUser1');
  });

  test('should return 401 for /me with no token', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.statusCode).toBe(401);
  });

  test('should return 401 for /me with bad token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer badtoken');

    expect(res.statusCode).toBe(401);
  });
});
