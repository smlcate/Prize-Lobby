const express = require('express');
const router = express.Router();
const knex = require('../models/db');
const { startMatchPolling } = require('../lib/startPolling');

// POST /api/dev/seed-test-challenge
router.post('/seed-test-challenge', async (req, res) => {
  try {
    // Create two test users if they don't exist
    const [user1] = await knex('users')
      .insert({ username: 'TestUser1', email: 'user1@example.com', password: 'hashedpass1' })
      .onConflict('email').ignore()
      .returning('*');

    const [user2] = await knex('users')
      .insert({ username: 'TestUser2', email: 'user2@example.com', password: 'hashedpass2' })
      .onConflict('email').ignore()
      .returning('*');

    // Fetch the inserted or existing users
    const u1 = user1 || await knex('users').where({ email: 'user1@example.com' }).first();
    const u2 = user2 || await knex('users').where({ email: 'user2@example.com' }).first();

    // Create a test challenge
    const [challenge] = await knex('challenges')
      .insert({
        creator_id: u1.id,
        title: 'Rocket League 1v1 Test Match',
        entry_fee: 100,
        platform_fee: 0.1,
        game: 'rocketleague',
        platform: 'epic',
        format: '1v1', // ✅ NEW FIELD
        status: 'created'
        })
        .returning('*');


    // Add both users as participants
    await knex('challenges_participants').insert([
      {
        challenge_id: challenge.id,
        user_id: u1.id,
        gamertag: 'GamerAlpha'
      },
      {
        challenge_id: challenge.id,
        user_id: u2.id,
        gamertag: 'RocketSam'
      }
    ]);

    // Update status to in_progress and start polling
    await knex('challenges')
      .where({ id: challenge.id })
      .update({ status: 'in_progress' });

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
});

module.exports = router;
