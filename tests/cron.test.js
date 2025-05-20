const { verifyApexMatch } = require('../services/matchVerifier');

describe('🕒 CRON MATCH VERIFICATION TESTS', () => {
  it('should verify a pending Apex match automatically', async () => {
    // Example hardcoded test match object
    const testMatch = {
      id: 1,
      challenge_id: 1,
      player1_id: 2,
      player2_id: 3,
      status: 'pending',
      game: 'apexlegends',
      platform: 'xbox',
      mode: 'duos',
      created_at: new Date(),
    };

    const result = await verifyApexMatch(testMatch.id);
    expect(result).toHaveProperty('verified', true);
  });
});
