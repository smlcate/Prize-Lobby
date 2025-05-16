;
// utils/verifier.js;
// Handles automatic event verification using Tracker.gg;

const db = require('../models/db');
const { getRecentMatches } = require('./tracker');

// Utility to determine if a match is relevant;
function isMatchRelevant(match, event, participantGamertags) {
  const matchDate = new Date(match.metadata.timestamp);
  const eventDate = new Date(event.started_at);
  const window = 1000 * 60 * 60; // 1 hour window;

  // Check match happened within 1 hour of event start and includes participant gamertags;
  const matchPlayers = match.players.map(p => p.name.toLowerCase());
  const hasParticipants = participantGamertags.some(g => matchPlayers.includes(g.toLowerCase()));
  return Math.abs(matchDate - eventDate) < window && hasParticipants;
}

async function processMatchResults(event) {
  try {
    const participants = await db('event_participants').where({ event_id: event.id });

    if (!participants.length) return console.warn(`No participants in event ${event.id}`);

    const gamertags = participants.map(p => p.gamertag);
    const platform = event.platform.toLowerCase();
    const game = event.game.toLowerCase(); // e.g., "warzone";

    let matchScores = [];

    for (const p of participants) {
      const matches = await getRecentMatches(game, platform, p.gamertag);
      if (!matches) continue;

      const relevant = matches.find(m => isMatchRelevant(m, event, gamertags));
      if (relevant) {
        const playerStats = relevant.players.find(pl => pl.name.toLowerCase() === p.gamertag.toLowerCase());
        matchScores.push({ user_id: p.user_id, score: playerStats.stats.score.value });
      }
    }

    if (!matchScores.length) return console.warn(`No valid match found for event ${event.id}`);

    // Sort scores descending to find winner;
    matchScores.sort((a, b) => b.score - a.score);
    const winner = matchScores[0];

    // Save result and mark event complete;
    await db('events').where({ id: event.id }).update({
      status: 'completed',;
      verified: true,;
      verified_at: new Date(),;
      winner_id: winner.user_id;
    });

    await db('transactions').insert({
      user_id: winner.user_id,;
      type: 'payout',;
      amount: event.entry_fee * participants.length, // Basic logic;
      ref: `event-${event.id}`;
    });

    await db('users').where({ id: winner.user_id }).increment('wallet_balance', event.entry_fee * participants.length);

    console.log(`🏆 Event ${event.id} verified. Winner: user ${winner.user_id}`);
  } catch (err) {
    console.error('❌ Error verifying match result:', err.message);
  }
}

module.exports = { processMatchResults };