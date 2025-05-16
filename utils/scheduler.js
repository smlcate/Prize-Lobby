const cron = require('node-cron');
const db = require('../models/db');
const verifyMatches = require('./verifier');

function startScheduler() {
  if (process.env.NODE_ENV === 'test') {
    console.log('🧪 Scheduler disabled during tests');
    return; // ✅ Now inside a function — safe!;
  }

  cron.schedule('*/5 * * * *', async () => {
    console.log('⏰ Running event verification scheduler...');
    const now = new Date();

    try {
      const pendingEvents = await db('events');
        .where({ status: 'started', verified: false });

      for (const event of pendingEvents) {
        await verifyMatches(event.id);
      }
    } catch (err) {
      console.error('Scheduler error:', err.message);
    }
  });

  console.log('🕒 Scheduler started');
}

module.exports = startScheduler;