// File: tests/gamertag.test.js

const request = require('supertest');
const app = require('../app');
const db = require('../models/db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key';
const token = jwt.sign({ id: 101 }, JWT_SECRET);

let gamertagId;

describe('🎮 GAMERTAG API TESTS', () => {
  beforeAll(async () => {
    // Clean up any existing gamertag for the test user/platform
    await db('gamertags').where({ user_id: 101, platform: 'steam' }).del();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('➕ Add Gamertag - should allow a user to add a new gamertag', async () => {
    const res = await request(app)
      .post('/api/gamertags')
      .set('Authorization', `Bearer ${token}`)
      .send({ platform: 'steam', gamertag: 'RocketGod123' });

    console.log('Add Gamertag:', res.statusCode, res.body);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('platform', 'steam');
    gamertagId = res.body.id;
  });

  it('➕ Add Gamertag - should reject duplicate platform gamertags for the same user', async () => {
    const res = await request(app)
      .post('/api/gamertags')
      .set('Authorization', `Bearer ${token}`)
      .send({ platform: 'steam', gamertag: 'AnotherTag' });

    expect(res.statusCode).toBe(400);
  });

  it('📝 Update Gamertag - should update an existing platform gamertag', async () => {
    const res = await request(app)
      .put(`/api/gamertags/steam`)
      .set('Authorization', `Bearer ${token}`)
      .send({ gamertag: 'UpdatedRocketGod' });

    expect([200, 204]).toContain(res.statusCode);
  });

  it('📝 Update Gamertag - should reject update if body is missing gamertag', async () => {
    const res = await request(app)
      .put(`/api/gamertags/steam`)
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);
  });

  it('🧹 Delete Gamertag - should delete the gamertag for a specific platform', async () => {
    const res = await request(app)
      .delete(`/api/gamertags/steam`)
      .set('Authorization', `Bearer ${token}`);

    expect([200, 204]).toContain(res.statusCode);
  });
});
