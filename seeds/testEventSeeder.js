
// seeds/testEventSeeder.js
// This script seeds a full test 1v1 event with dummy users, gamertags, wallets, and joins

const db = require('../models/db');
const bcrypt = require('bcrypt');

async function seedTestEvent() {
  try {
    console.log('🚀 Starting seed...');

    // Wipe test data
    await db('event_participants').del();
    await db('events').del();
    await db('gamertags').del();
    await db('transactions').del();
    await db('users').where('email', 'like', 'dummy%@example.com').del();

    // Create 2 users
    const passwordHash = await bcrypt.hash('test1234', 10);
    const [user1] = await db('users').insert({
      username: 'dummy1',
      email: 'dummy1@example.com',
      password: passwordHash
    }).returning('id');
    
    const [user2] = await db('users').insert({
      username: 'dummy2',
      email: 'dummy2@example.com',
      password: passwordHash
    }).returning('id');

    const user1Id = user1.id;
    const user2Id = user2.id;

    // Add gamertags
    await db('gamertags').insert([
      { user_id: user1Id, platform: 'xbox', gamertag: 'DummyOne' },
      { user_id: user2Id, platform: 'xbox', gamertag: 'DummyTwo' }
    ]);

    // Add wallet funds
    await db('users').whereIn('id', [user1Id, user2Id]).update({ wallet_balance: 10000 });

    // Create event
    const [event] = await db('events').insert({
      creator_id: user1Id,
      title: '1v1 Test Match',
      type: 'challenge',
      game: 'warzone',
      format: '1v1',
      entry_fee: 5000,
      max_players: 2,
      platform: 'xbox',
      status: 'pending'
    }).returning('id');

    const eventId = event.id;

    // Join event
    await db('event_participants').insert([
      { event_id: eventId, user_id: user1Id, gamertag: 'DummyOne', platform: 'xbox' },
      { event_id: eventId, user_id: user2Id, gamertag: 'DummyTwo', platform: 'xbox' }
    ]);

    // Start the event
    await db('events')
      .where({ id: eventId })
      .update({ status: 'started', started_at: new Date(), updated_at: new Date() });

    console.log(`✅ Test event seeded. Event ID: ${eventId}`);
  } catch (err) {
    console.error('❌ Seed error:', err);
  } finally {
    db.destroy();
  }
}

seedTestEvent();
