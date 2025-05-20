
const db = require('../models/db');

async function logMatch({ user_id, game, platform, mode, score = 0, win = false, xp_earned = 0, prize_earned = 0, source_type, source_id }) {
  try {
    await db('match_history').insert({
      user_id,
      game,
      platform,
      mode,
      score,
      win,
      xp_earned,
      prize_earned,
      source_type,
      source_id
    });
    console.log(`✅ Logged match for user ${user_id} (${game}, ${platform}, ${mode})`);
  } catch (err) {
    console.error('❌ Error logging match history:', err);
  }
}

module.exports = { logMatch };
