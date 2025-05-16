// File: services/matchService.js

const db = require('../db');

async function updateParticipantWithMatch(userId, matchId, matchTime) {
  try {
    // Check event participant
    const eventParticipant = await db('event_participants')
      .where({ user_id: userId })
      .whereNull('tracker_match_id')
      .first();

    if (eventParticipant) {
      await db('event_participants')
        .where({ id: eventParticipant.id })
        .update({ tracker_match_id: matchId, result_verified: false, start_guess_time: matchTime });
      return;
    }

    // Check challenge participant
    const challengeParticipant = await db('challenges_participants')
      .where({ user_id: userId })
      .whereNull('tracker_match_id')
      .first();

    if (challengeParticipant) {
      await db('challenges_participants')
        .where({ id: challengeParticipant.id })
        .update({ tracker_match_id: matchId, result_verified: false, start_guess_time: matchTime });
    }
  } catch (err) {
    console.error('❌ Failed to update participant with match:', err);
  }
}

module.exports = { updateParticipantWithMatch };
