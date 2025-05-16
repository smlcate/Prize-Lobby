// routes/events.js
const express = require('express');
const router = express.Router();
const db = require('../models/db');
const verifyToken = require('../middleware/authenticate');

console.log('✅ Events routes loaded');

// GET /api/events - dummy route for auth testing
router.get('/', verifyToken, async (req, res) => {
  res.json({ message: 'Authorized access' });
});

// POST /api/events - create new event
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      title,
      game,
      platform,
      format,
      entry_fee,
      max_players,
      type,
      prize_pool
    } = req.body;

    const creator_id = req.user.id;

    const [event] = await db('events')
      .insert({
        creator_id,
        title,
        game,
        platform,
        format,
        entry_fee,
        max_players,
        type,
        prize_pool,
        status: 'pending'
      })
      .returning('*');

    res.status(201).json(event);
  } catch (err) {
    console.error('❌ Event creation failed:', err);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// POST /api/events/:id/join - join an event
router.post('/:id/join', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const eventId = parseInt(req.params.id);

  try {
    const event = await db('events').where({ id: eventId }).first();
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const alreadyJoined = await db('event_participants')
      .where({ event_id: eventId, user_id: userId })
      .first();
    if (alreadyJoined) return res.status(400).json({ error: 'Already joined' });

    const wallet = await db('wallets').where({ user_id: userId }).first();
    if (!wallet || wallet.balance < event.entry_fee) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    await db('wallets')
      .where({ user_id: userId })
      .update({ balance: wallet.balance - event.entry_fee });

    await db('event_participants').insert({
      event_id: eventId,
      user_id: userId
    });

    res.json({ message: 'Successfully joined event' });
  } catch (err) {
    console.error('❌ Failed to join event:', err);
    res.status(500).json({ error: 'Failed to join event' });
  }
});


module.exports = router;
