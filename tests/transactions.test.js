const request = require('supertest');
const app = require('../server');
const { getTokenForUser } = require('./helpers/tokenHelper');

describe('💳 TRANSACTION LOG API TESTS', () => {
  let token;

  beforeAll(async () => {
    token = await getTokenForUser('WalletUser');
  });

  describe('📄 Get Transactions', () => {
    it('should return a list of transactions for the user', async () => {
      const res = await request(app)
        .get('/api/transactions')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);

      if (res.body.length > 0) {
        const tx = res.body[0];
        expect(tx).toHaveProperty('amount');
        expect(tx).toHaveProperty('type');
        expect(tx).toHaveProperty('created_at');
      }
    });

    it('should return 401 if no token provided', async () => {
      const res = await request(app).get('/api/transactions');
      expect(res.statusCode).toBe(401);
    });
  });
});