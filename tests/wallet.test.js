
const request = require('supertest');
const app = require('../app');
const db = require('../models/db');
const { getTokenForUser } = require('./helpers');

describe('💰 Wallet Routes', () => {
  let token;

  beforeAll(async () => {
    token = await getTokenForUser('TestUser2');
  });

  it('should return wallet balance and history', async () => {
    const res = await request(app)
      .get('/api/wallet/balance')
      .set('Authorization', `Bearer ${token}`);

    console.log('Balance Response:', res.statusCode, res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('balance');
    expect(res.body).toHaveProperty('history');
    expect(Array.isArray(res.body.history)).toBe(true);
  });

  it('should create a deposit intent', async () => {
    const payload = { amount: 500 };
    console.log('📤 Sent Payload:', payload);

    const res = await request(app)
      .post('/api/wallet/deposit-intent')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    console.log('📥 Deposit Intent Response:', res.statusCode, res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('client_secret');
    expect(res.body).toHaveProperty('amount', 500);
  });

  it('should reject withdrawal if balance is low', async () => {
    const res = await request(app)
      .post('/api/wallet/withdraw')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 100000 }); // Large amount to ensure rejection

    console.log('Withdrawal Response:', res.statusCode, res.body);
    expect([400, 403]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('error');
  });

  it('should submit a valid withdrawal request', async () => {
    const res = await request(app)
      .post('/api/wallet/withdraw')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 100 }); // Small valid amount

    console.log('Successful Withdrawal:', res.statusCode, res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});
