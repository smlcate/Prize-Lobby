const db = require('../models/db');

// ✅ Get all events (for event list view)
const getAllEvents = async (req, res) => {
  try {
    const events = await db('events').select('*').orderBy('created_at', 'desc');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve events' });
  }
};

// ✅ Get a specific event by ID
const getEventById = async (req, res) => {
  try {
    const event = await db('events').where({ id: req.params.id }).first();
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const participants = await db('event_participants')
      .join('users', 'event_participants.user_id', 'users.id')
      .select(
        'event_participants.user_id',
        'event_participants.gamertag',
        'event_participants.platform',
        'event_participants.score',
        'users.username'
      )
      .where({ event_id: event.id });

    res.json({
      ...event,
      participants: participants.sort((a, b) => b.score - a.score)
    });
  } catch (err) {
    console.error('Error fetching event details:', err);
    res.status(500).json({ error: 'Failed to fetch event details' });
  }
};


// ✅ Create a new event
const createEvent = async (req, res) => {
  const {
    title, type, game, format,
    entry_fee, max_players, platform, rules
  } = req.body;

  try {
    const [id] = await db('events')
      .insert({
        creator_id: req.user.id,
        title,
        type,
        game,
        format,
        entry_fee,
        max_players,
        platform,
        rules
      })
      .returning('id');

    res.status(201).json({ message: 'Event created', event_id: id });
  } catch (err) {
    res.status(400).json({ error: 'Failed to create event', details: err.message });
  }
};

// ✅ Join an event (with platform/gamertag validation)
const joinEvent = async (req, res) => {
  const eventId = req.params.eventId;

  try {
    const event = await db('events').where({ id: eventId }).first();
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const tag = await db('gamertags')
      .where({ user_id: req.user.id })
      .andWhere(builder =>
        builder.where('platform', event.platform).orWhere('platform', 'crossplay')
      )
      .first();

    if (!tag) {
      return res.status(403).json({ error: 'No compatible gamertag for this platform' });
    }

    await db('event_participants').insert({
      event_id: eventId,
      user_id: req.user.id,
      gamertag: tag.gamertag,
      platform: tag.platform
    });

    res.status(200).json({ message: 'Joined event successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to join event', details: err.message });
  }
};

// ✅ Start an event (host only)
const startEvent = async (req, res) => {
  const eventId = req.params.eventId;

  try {
    const event = await db('events').where({ id: eventId }).first();
    if (!event) return res.status(404).json({ error: 'Event not found' });

    if (event.creator_id !== req.user.id) {
      return res.status(403).json({ error: 'Only the host can start the event' });
    }

    await db('events').where({ id: eventId }).update({
      status: 'started',
      started_at: new Date()
    });

    res.status(200).json({ message: 'Event started' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to start event', details: err.message });
  }
};

// ✅ Complete event, calculate winner & handle payouts
const completeEvent = async (req, res) => {
  const eventId = req.params.eventId;

  try {
    const event = await db('events').where({ id: eventId }).first();
    if (!event) return res.status(404).json({ error: 'Event not found' });

    if (event.status !== 'started') {
      return res.status(400).json({ error: 'Event must be started before completing' });
    }

    const participants = await db('event_participants')
      .where({ event_id: eventId })
      .orderBy('score', 'desc');

    if (participants.length < 1) {
      return res.status(400).json({ error: 'No participants in event' });
    }

    const winner = participants[0];

    const totalPool = participants.length * event.entry_fee;
    const siteFee = Math.floor(totalPool * 0.1);
    const payout = totalPool - siteFee;

    await db('users')
      .where({ id: winner.user_id })
      .increment('wallet_balance', payout);

    await db('transactions').insert({
      user_id: winner.user_id,
      type: 'payout',
      amount: payout,
      ref: `event-${eventId}`
    });

    await db('events').where({ id: eventId }).update({
      status: 'completed',
      verified: true,
      verified_at: new Date(),
      winner_id: winner.user_id
    });

    res.status(200).json({ message: 'Event completed and prize awarded' });
  } catch (err) {
    console.error('❌ Error completing event:', err);
    res.status(500).json({ error: 'Prize payout failed', details: err.message });
  }
};

// ✅ Admin/manual event result verification fallback
const verifyEventResults = async (req, res) => {
  const eventId = req.params.eventId;

  try {
    await db('events')
      .where({ id: eventId })
      .update({ verified: true, verified_at: new Date() });

    res.status(200).json({ message: 'Event manually verified' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify event', details: err.message });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  joinEvent,
  startEvent,
  completeEvent,
  verifyEventResults
};
