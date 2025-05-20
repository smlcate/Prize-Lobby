
const db = require('../models/db');

async function rebuildLeaderboard() {
  try {
    const aggregated = await db('match_history')
      .select('user_id', 'game', 'platform')
      .sum({ total_prize: 'prize_earned', total_xp: 'xp_earned' })
      .count({ total_matches: 'id' })
      .sum({ total_wins: db.raw('CASE WHEN win THEN 1 ELSE 0 END') })
      .groupBy('user_id', 'game', 'platform');

    await db('leaderboard').truncate();

    for (const row of aggregated) {
      await db('leaderboard').insert({
        user_id: row.user_id,
        game: row.game,
        platform: row.platform,
        total_prize: row.total_prize,
        total_matches: row.total_matches,
        total_wins: row.total_wins,
        total_xp: row.total_xp
      });
    }

    console.log(`✅ Rebuilt leaderboard with ${aggregated.length} records`);
  } catch (err) {
    console.error('❌ Error rebuilding leaderboard:', err);
  }
}

module.exports = { rebuildLeaderboard };
