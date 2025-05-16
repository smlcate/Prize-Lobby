// utils/matchUtils.js
const db = require('../db');
const { DateTime } = require('luxon');
const { getGamertagsForEvent, getGamertagsForChallenge } = require('./gamertagUtils');

// Mark a match or lobby as "started" when all players have joined
async function checkAndMarkEventStarted(eventId) {
  const participants = await db('event_participants').where({ event_id: eventId });
  const event = await db('events').where({ id: eventId }).first();

  const requiredPlayers = event.max_players || event.min_players || 2;

  if (participants.length >= requiredPlayers && event.status === 'pending') {
    await db('events')
      .where({ id: eventId })
      .update({ status: 'started', started_at: new Date() });

    // Set a "start guess" time for tracker matching
    await db('event_participants')
      .where({ event_id: eventId })
      .update({ start_guess_time: new Date() });

    console.log(`🚀 Event ${eventId} marked as started.`);
    return true;
  }

  return false;
}

// Same logic for challenges (e.g. 1v1s)
async function checkAndMarkChallengeStarted(challengeId) {
  const participants = await db('challenges_participants').where({ challenge_id: challengeId });
  const challenge = await db('challenges').where({ id: challengeId }).first();

  if (participants.length >= 2 && challenge.status === 'pending') {
    await db('challenges')
      .where({ id: challengeId })
      .update({ status: 'started', started_at: new Date() });

    await db('challenges_participants')
      .where({ challenge_id: challengeId })
      .update({ start_guess_time: new Date() });

    console.log(`🎯 Challenge ${challengeId} marked as started.`);
    return true;
  }

  return false;
}

module.exports = {
  checkAndMarkEventStarted,
  checkAndMarkChallengeStarted
};
