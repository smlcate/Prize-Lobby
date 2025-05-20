const db = require('../models/db');
const { startMatchPolling } = require('../lib/startPolling');

exports.seedTestChallenge = async (req, res) => {
  try {
    const [user1] = await db('users')
      .insert({ username: 'TestUser1', email: 'user1@example.com', password: 'hashedpass1' })
      .onConflict('email').ignore().returning('*');

    const [user2] = await db('users')
      .insert({ username: 'TestUser2', email: 'user2@example.com', password: 'hashedpass2' })
      .onConflict('email').ignore().returning('*');

    const u1 = user1 || await db('users').where({ email: 'user1@example.com' }).first();
    const u2 = user2 || await db('users').where({ email: 'user2@example.com' }).first();

    const [challenge] = await db('challenges').insert({
      creator_id: u1.id,
      title: 'Rocket League 1v1 Test Match',
      entry_fee: 100,
      platform_fee: 0.1,
      game: 'rocketleague',
      platform: 'epic',
      format: '1v1',
      status: 'created'
    }).returning('*');

    await db('challenges_participants').insert([
      { challenge_id: challenge.id, user_id: u1.id, gamertag: 'GamerAlpha' },
      { challenge_id: challenge.id, user_id: u2.id, gamertag: 'RocketSam' }
    ]);

    await db('challenges').where({ id: challenge.id }).update({ status: 'in_progress' });

    startMatchPolling(challenge.id);

    res.json({
      message: 'Test challenge and participants seeded successfully',
      challenge_id: challenge.id,
      users: [u1.id, u2.id]
    });
  } catch (err) {
    console.error('Seeding failed:', err);
    res.status(500).json({ error: 'Seeding failed' });
  }
};
