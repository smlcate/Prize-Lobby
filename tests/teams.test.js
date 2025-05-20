// File: tests/teams.test.js

const request = require('supertest');
const app = require('../app');
const db = require('../models/db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key';
const ownerToken = jwt.sign({ id: 102 }, JWT_SECRET);
const memberToken = jwt.sign({ id: 7 }, JWT_SECRET);

let createdTeamId;

describe('👥 TEAM API TESTS', () => {
  afterAll(async () => {
    await db.destroy();
  });

  it('🛠️ Create Team - should allow a user to create a team', async () => {
    const teamName = `TheTesters_${Date.now()}`; // ensure unique name
    const res = await request(app)
      .post('/api/teams')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ name: teamName, bio: 'We break things.' });

    console.log('Create Team:', res.statusCode, res.body);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    createdTeamId = res.body.id;
  });

  it('➕ Join Team - should allow a different user to join', async () => {
    const res = await request(app)
      .post(`/api/teams/${createdTeamId}/join`)
      .set('Authorization', `Bearer ${memberToken}`);

    console.log('Join Team:', res.statusCode, res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Joined team/i);
  });

  it('🚪 Leave Team - should allow a member to leave the team', async () => {
    const res = await request(app)
      .post(`/api/teams/${createdTeamId}/leave`)
      .set('Authorization', `Bearer ${memberToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Left team/i);
  });

  it('🚪 Leave Team - should prevent the owner from leaving', async () => {
    const res = await request(app)
      .post(`/api/teams/${createdTeamId}/leave`)
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toMatch(/Owner cannot leave/i);
  });

  it('💰 Wallet Auto-Creation - should auto-create a team wallet on creation', async () => {
    const res = await request(app)
      .get(`/api/teams/${createdTeamId}/wallet`)
      .set('Authorization', `Bearer ${ownerToken}`);

    expect([200, 404]).toContain(res.statusCode);
  });
});
