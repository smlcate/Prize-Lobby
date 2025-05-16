const db = require('../models/db');

async function seedTestData() {
  try {
    // Clear tables in proper order
    await db('event_participants').del();
    await db('bracket_matches').del();
    await db('events').del();
    await db('gamertags').del();
    await db('transactions').del();
    await db('wallets').del();
    await db('users').del();

    // Insert test users
    const [{ id: userId1 }] = await db('users').insert({
      username: 'TestUser1',
      email: 'test1@example.com',
      password: 'hashedpassword1',
      is_admin: true
    }).returning('id');

    const [{ id: userId2 }] = await db('users').insert({
      username: 'TestUser2',
      email: 'test2@example.com',
      password: 'hashedpassword2',
      is_admin: false
    }).returning('id');


    // Wallets
    await db('wallets').insert([
      { user_id: userId1, balance: 10000 },
      { user_id: userId2, balance: 5000 }
    ]);

    await db('events').insert({
      creator_id: userId1,
      title: 'Test Event',
      game: 'Call of Duty',
      platform: 'Xbox',
      entry_fee: 500,
      prize_pool: 1000,
      started_at: new Date(),
      max_players: 16,
      format: 'single_elim',
      type: 'challenge'
    });


    console.log('✅ Test data seeded!');
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    console.error(error.stack);
    throw error;
  }
}

module.exports = seedTestData;
