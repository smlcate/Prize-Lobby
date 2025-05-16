const db = require('../models/db');

async function createNotification(user_id, type, message, io = null, userSockets = {}) {
  try {
    const [note] = await db('notifications')
      .insert({ user_id, type, message })
      .returning('*');

    // Send live update if available
    if (io && userSockets[user_id]) {
      io.to(userSockets[user_id]).emit('notification', note);
    }
  } catch (err) {
    console.error('[createNotification]', err);
  }
}

module.exports = { createNotification };
