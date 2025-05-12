const db = require('../models/db');

const createEvent = async (req, res) => {
  const { title, type, game, format, entry_fee, max_players, platform, rules } = req.body;
  try {
    const [id] = await db('events').insert({
      creator_id: req.user.id,
      title,
      type,
      game,
      format,
      entry_fee,
      max_players,
      platform,
      rules
    }).returning('id');

    res.status(201).json({ message: 'Event created', event_id: id });
  } catch (err) {
    res.status(400).json({ error: 'Failed to create event', details: err.message });
  }
};

const joinEvent = async (req, res) => {
  const eventId = req.params.eventId;

  try {
    const event = await db('events').where({ id: eventId }).first();
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // Check for platform-compatible gamertag
    const tag = await db('gamertags')
      .where({ user_id: req.user.id })
      .andWhere(function () {
        this.where('platform', event.platform).orWhere('platform', 'crossplay');
      })
      .first();

    if (!tag) {
      return res.status(403).json({ error: 'No compatible gamertag for this platform' });
    }

    // Check wallet balance
    const user = await db('users').where({ id: req.user.id }).first();
    if (user.wallet_balance < event.entry_fee) {
      return res.status(403).json({ error: 'Insufficient wallet balance' });
    }

    // Deduct from wallet and credit prize pool
    await db.transaction(async trx => {
      await trx('users')
        .where({ id: req.user.id })
        .decrement('wallet_balance', event.entry_fee);

      await trx('events')
        .where({ id: eventId })
        .increment('prize_pool', event.entry_fee);

      await trx('event_participants').insert({
        event_id: eventId,
        user_id: req.user.id,
        gamertag: tag.gamertag,
        platform: tag.platform
      });

      await trx('transactions').insert({
        user_id: req.user.id,
        type: 'entry_fee',
        amount: -event.entry_fee,
        ref: `event:${eventId}`
      });
    });

    res.status(200).json({ message: 'Joined event successfully' });
  } catch (err) {
    console.error('Join event error:', err);
    res.status(400).json({ error: 'Failed to join event', details: err.message });
  }
};


const startEvent = async (req, res) => {
  const eventId = req.params.eventId;
  try {
    const event = await db('events').where({ id: eventId }).first();
    if (!event) return res.status(404).json({ error: 'Event not found' });

    if (event.creator_id !== req.user.id) {
      return res.status(403).json({ error: 'Only the host can start the event' });
    }

    await db('events')
      .where({ id: eventId })
      .update({ status: 'started', updated_at: new Date() });

    res.status(200).json({ message: 'Event started' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to start event', details: err.message });
  }
};

const completeEvent = async (req, res) => {
  const eventId = req.params.eventId;

  try {
    const event = await db('events').where({ id: eventId }).first();
    if (!event) return res.status(404).json({ error: 'Event not found' });
    if (event.status !== 'started') return res.status(400).json({ error: 'Event not started or already completed' });

    const participants = await db('event_participants')
      .where({ event_id: eventId })
      .orderBy('score', 'desc'); // Later, this can reflect real results

    if (participants.length < 2) {
      return res.status(400).json({ error: 'Not enough participants for a payout' });
    }

    const winner = participants[0];
    const prizePool = event.prize_pool;

    const feeSetting = await db('settings').where({ key: 'platform_fee_percent' }).first();
    const feePercent = parseFloat(feeSetting?.value || '10');
    const feeAmount = Math.floor(prizePool * (feePercent / 100));
    const payout = prizePool - feeAmount;

    await db.transaction(async trx => {
      // Update event
      await trx('events').where({ id: eventId }).update({
        status: 'completed',
        updated_at: new Date()
      });

      // Update winner wallet
      await trx('users')
        .where({ id: winner.user_id })
        .increment('wallet_balance', payout);

      // Record transactions
      await trx('transactions').insert([
        {
          user_id: winner.user_id,
          type: 'winnings',
          amount: payout,
          ref: `event:${eventId}`
        },
        {
          user_id: null, // or system account
          type: 'platform_fee',
          amount: feeAmount,
          ref: `event:${eventId}`
        }
      ]);
    });

    res.status(200).json({ message: 'Event completed, prize paid' });
  } catch (err) {
    console.error('❌ completeEvent error:', err);
    res.status(500).json({ error: 'Prize payout failed', details: err.message });
  }
};


const getAllEvents = async (req, res) => {
  try {
    const events = await db('events').select('*');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events', details: err.message });
  }
};

const getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await db('events').where({ id }).first();
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event', details: err.message });
  }
};

module.exports = {
  createEvent,
  joinEvent,
  startEvent,
  completeEvent,
  getAllEvents,
  getEventById
};
