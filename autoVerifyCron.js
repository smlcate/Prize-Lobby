
'use strict';

const cron = require('node-cron');
const db = require('./models/db');
const { verifyApexMatch } = require('./utils/apexVerifyHelper');

// This cron job runs every minute
cron.schedule('* * * * *', async () => {
  console.log('🕒 Running auto-verification + bracket advancement cron...');

  try {
    const now = new Date();
    const graceBuffer = new Date(now.getTime() - 5 * 60 * 1000);

    const matches = await db('bracket_matches')
      .where({ result_verified: false, status: 'in_progress' })
      .andWhere('start_time', '<', graceBuffer);

    for (const match of matches) {
      console.log(`🔍 Checking match ID ${match.id}...`);

      const players = [
        { id: match.player1_id, field: 'player1_id' },
        { id: match.player2_id, field: 'player2_id' }
      ];

      for (const player of players) {
        const gamertag = await db('gamertags').where({ user_id: player.id }).first();
        if (!gamertag) {
          console.log(`⚠️ No gamertag found for user ${player.id}`);
          continue;
        }

        // Simulate results if username starts with "test_"
        if (gamertag.gamertag.startsWith('test_')) {
          const kills = Math.floor(Math.random() * 10);
          const damage = Math.floor(Math.random() * 2000);
          const scoreData = { kills, damage, match_id: 'simulated-' + Date.now() };

          await db('bracket_matches')
            .where({ id: match.id })
            .update({
              result_verified: true,
              score_data: JSON.stringify(scoreData)
            });

          console.log(`🧪 Simulated verification for test user ${player.id}:`, scoreData);
          continue;
        }

        // Real verification
        const result = await verifyApexMatch(
          player.id,
          gamertag.platform,
          gamertag.gamertag,
          {
            match_id: match.id,
            started_at: match.start_time || match.created_at
          }
        );

        console.log(`🧪 Verified player ${player.id}:`, result);
      }
    }

    // ✅ Auto-advance logic
    const verifiedMatches = await db('bracket_matches')
      .where({ result_verified: true, status: 'in_progress' });

    for (const match of verifiedMatches) {
      const scoreData = match.score_data ? JSON.parse(match.score_data) : {};
      if (!scoreData || !scoreData.kills) continue;

      const player1Score = await db('gamertags')
        .where({ user_id: match.player1_id }).first()
        .then(tag => tag?.gamertag.startsWith('test_') ? JSON.parse(match.score_data)?.kills : 0);

      const player2Score = await db('gamertags')
        .where({ user_id: match.player2_id }).first()
        .then(tag => tag?.gamertag.startsWith('test_') ? JSON.parse(match.score_data)?.kills : 0);

      let winnerId = null;
      if (player1Score > player2Score) winnerId = match.player1_id;
      else if (player2Score > player1Score) winnerId = match.player2_id;

      if (winnerId) {
        await db('bracket_matches').where({ id: match.id }).update({
          status: 'complete',
          winner_id: winnerId
        });

        // Find next round match
        const nextRound = match.round + 1;
        const nextMatchNumber = Math.floor(match.match_number / 2);

        const nextMatch = await db('bracket_matches')
          .where({
            event_id: match.event_id,
            round: nextRound,
            match_number: nextMatchNumber
          }).first();

        if (nextMatch) {
          const fieldToUpdate = (match.match_number % 2 === 0) ? 'player1_id' : 'player2_id';
          await db('bracket_matches')
            .where({ id: nextMatch.id })
            .update({ [fieldToUpdate]: winnerId });

          console.log(`🏆 Advanced winner ${winnerId} to match ${nextMatch.id}`);
        }
      }
    }

    console.log('✅ Auto-verification and bracket update complete.');
  } catch (err) {
    console.error('❌ Cron error:', err.message);
  }
});
