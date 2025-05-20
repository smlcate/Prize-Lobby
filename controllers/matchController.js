// controllers/matchController.js
const db = require('../models/db');
const { distributeEventPrizeWithTeams } = require('../utils/payout_with_teams_event');

module.exports = {
  async startEvent(req, res) {
    try {
      const { event_id } = req.body;

      const event = await db('events').where({ id: event_id }).first();
      if (!event) return res.status(404).json({ error: 'Event not found' });

      await db('events').where({ id: event_id }).update({ status: 'started' });

      res.json({ success: true, message: 'Event started' });
    } catch (err) {
      console.error('❌ Error starting event:', err);
      res.status(500).json({ error: 'Failed to start event' });
    }
  },

  async checkEventMatch(req, res) {
    try {
      const event_id = req.params.id;
      const event = await db('events').where({ id: event_id }).first();
      if (!event) return res.status(404).json({ error: 'Event not found' });

      const resultReady = event.result_verified;
      const winner = await db('event_participants').where({ event_id, is_winner: true }).first();

      if (resultReady && winner) {
        await distributeEventPrizeWithTeams(event_id);
      }

      res.json({
        result_verified: resultReady,
        winner_id: winner?.user_id || null,
        players: await db('event_participants').where({ event_id })
      });
    } catch (err) {
      console.error('❌ Error checking match:', err);
      res.status(500).json({ error: 'Failed to check match' });
    }
  }
};