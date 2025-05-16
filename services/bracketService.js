
// services/bracketService.js
// This service manages bracket generation and automatic progression.

const db = require('../models/db');

// Generate bracket matchups for an event (e.g., after it is started)
async function generateBracket(eventId) {
  const participants = await db('event_participants')
    .where({ event_id: eventId })
    .orderByRaw('RANDOM()');

  if (participants.length < 2) {
    throw new Error('Not enough participants to start a bracket.');
  }

  const rounds = [];
  let currentRound = [...participants];
  let roundNum = 1;

  while (currentRound.length > 1) {
    const nextRound = [];
    const matchups = [];

    while (currentRound.length >= 2) {
      const p1 = currentRound.shift();
      const p2 = currentRound.shift();

      const matchId = await db('matches')
        .insert({
          event_id: eventId,
          round: roundNum,
          player1_id: p1.user_id,
          player2_id: p2.user_id,
          status: 'pending'
        })
        .returning('id');

      matchups.push(matchId[0]);
      nextRound.push({ match_id: matchId[0] });
    }

    // Handle bye if odd number of players
    if (currentRound.length === 1) {
      const byePlayer = currentRound.shift();
      const matchId = await db('matches')
        .insert({
          event_id: eventId,
          round: roundNum,
          player1_id: byePlayer.user_id,
          player2_id: null,
          status: 'bye'
        })
        .returning('id');

      matchups.push(matchId[0]);
      nextRound.push({ match_id: matchId[0], autoAdvance: true, player_id: byePlayer.user_id });
    }

    rounds.push(matchups);
    currentRound = nextRound.map(m => ({ user_id: m.player_id })); // prepare next round
    roundNum++;
  }

  return rounds;
}

module.exports = {
  generateBracket
};
