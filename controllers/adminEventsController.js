const db = require('../models/db');

exports.getAllEvents = async (req, res) => {
  try {
    const events = await db('events').orderBy('created_at', 'desc');
    res.json(events);
  } catch (err) {
    console.error('Failed to fetch admin events:', err);
    res.status(500).json({ error: 'Failed to load events' });
  }
};

exports.forceStart = async (req, res) => {
  const eventId = req.params.id;

  try {
    const event = await db('events').where({ id: eventId }).first();
    if (!event) return res.status(404).json({ error: 'Event not found' });

    await db('events').where({ id: eventId }).update({
      started: true,
      start_time: new Date()
    });

    res.json({ message: 'Event started successfully' });
  } catch (err) {
    console.error('Failed to start event:', err);
    res.status(500).json({ error: 'Could not start event' });
  }
};
