
const request = require('supertest');
const app = require('../server');
const { getTokenForUser } = require('./helpers/tokenHelper');

describe('Wallet Routes', () => {
  it('should deposit funds (mocked)', async () => {
    const token = await getTokenForUser('TestUser2');
    const res = await request(app)
      .post('/api/wallet/deposit')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 500 });
    console.log('Response:', res.statusCode, res.body);
    expect([200, 201]).toContain(res.statusCode);
  });

  it('should reject withdrawal if balance is low', async () => {
    const token = await getTokenForUser('TestUser2');
    const res = await request(app)
      .post('/api/wallet/withdraw')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 999999 });
    console.log('Response:', res.statusCode, res.body);
    expect([400, 403]).toContain(res.statusCode);
  });
});
