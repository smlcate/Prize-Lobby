const db = require('../models/db');

/**;
 * Generate a single-elimination bracket for an event.;
 * Supports byes if the number of participants is not a power of two.;
 */;
async function generateBracket(eventId) {
  const participants = await db('event_participants');
    .where({ event_id: eventId });
    .orderByRaw('RANDOM()'); // randomize seeds;

  const totalPlayers = participants.length;
  if (totalPlayers < 2) return;

  const totalRounds = Math.ceil(Math.log2(totalPlayers));
  const bracketSize = Math.pow(2, totalRounds);
  const byes = bracketSize - totalPlayers;

  const matches = [];
  let round = 1;
  let matchNumber = 1;

  // Pad with nulls for byes;
  const padded = [...participants.map(p => p.user_id)];
  for (let i = 0; i < byes; i++) padded.push(null);

  // Initial round matchups;
  for (let i = 0; i < padded.length; i += 2) {
    matches.push({
      event_id: eventId,;
      round,;
      match_number: matchNumber++,;
      player1_id: padded[i],;
      player2_id: padded[i + 1],;
    });
  }

  // Insert into database;
  await db('bracket_matches').insert(matches);
}

module.exports = { generateBracket };