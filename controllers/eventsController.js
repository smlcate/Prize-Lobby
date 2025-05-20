const db = require('../models/db');

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const { title, game, platform, start_time, status, format, mode } = req.body;
    const creator_id = req.user.id;

    const [event] = await db('events')
      .insert({
        title,
        game,
        platform,
        start_time,
        status: status || 'created',
        creator_id,
        format: format || 'standard',
        mode: mode || 'solo',
      })
      .returning('*');

    res.status(201).json(event);
  } catch (err) {
    console.error('❌ Failed to create event:', err);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

// Get all events
exports.getAllEvents = async (_req, res) => {
  try {
    const events = await db('events').orderBy('created_at', 'desc');
    res.json(events);
  } catch (err) {
    console.error('❌ Failed to fetch events:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// Get single event by ID
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await db('events').where({ id }).first();
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    console.error('❌ Failed to fetch event:', err);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
};
