// utils/matchVerifier.js

const axios = require('axios');
const db = require('../models/db');
const { createNotification } = require('./notificationUtil'); // Adjust path if needed

const TRACKER_API_BASE = 'https://api.tracker.gg/api/v2/rocket-league/standard/profile';
const POLL_INTERVAL_MS = 20000; // 20 seconds
const MAX_ATTEMPTS = 15;

async function fetchRecentMatches(platform, gamertag) {
  try {
    const url = `${TRACKER_API_BASE}/${platform}/${encodeURIComponent(gamertag)}/matches`;
    const response = await axios.get(url, {
      headers: {
        'TRN-Api-Key': process.env.TRACKER_API_KEY,
      }
    });
    return response.data.data.matches || [];
  } catch (err) {
    console.error('Error fetching matches for', gamertag, err.response?.data || err.message);
    return [];
  }
}

function isMatchValid(match, startGuessTime) {
  const matchTime = new Date(match.metadata.timestamp);
  return matchTime > new Date(startGuessTime);
}

async function pollAndVerifyMatch(id, type = 'event') {
  const participantsTable = type === 'event' ? 'event_participants' : 'challenges_participants';
  const matchColumn = type === 'event' ? 'event_id' : 'challenge_id';

  const participants = await db(participantsTable)
    .where(matchColumn, id)
    .select('id', 'gamertag', 'platform', 'start_guess_time');

  if (participants.length === 0) return;

  let attempts = 0;
  const interval = setInterval(async () => {
    attempts++;
    if (attempts > MAX_ATTEMPTS) {
      console.warn('Match verification failed after max attempts.');
      clearInterval(interval);
      return;
    }

    console.log(`[Verifier] Attempt ${attempts} for ${type} ID ${id}`);

    const matchHistory = await Promise.all(participants.map(p =>
      fetchRecentMatches(p.platform, p.gamertag)
    ));

    // Flatten and deduplicate matches
    const allMatches = [].concat(...matchHistory);
    const filteredMatches = allMatches.filter(m =>
      isMatchValid(m, participants[0].start_guess_time)
    );

    const candidateMatch = filteredMatches[0];
    if (!candidateMatch) return;

    const playerStats = candidateMatch.players || [];

    for (const p of participants) {
      const stat = playerStats.find(s => s.metadata.platformUserHandle === p.gamertag);
      const score = stat?.stats?.score?.value || 0;
      await db(participantsTable)
        .where('id', p.id)
        .update({
          tracker_match_id: candidateMatch.id,
          result_verified: true,
          score,
        });
    }

    // Mark winner
    const scores = await db(participantsTable)
      .where(matchColumn, id)
      .orderBy('score', 'desc');

    const topScore = scores[0].score;
    for (const p of scores) {
      await db(participantsTable)
        .where('id', p.id)
        .update('is_winner', p.score === topScore);
    }

    console.log(`[Verifier] Attempt ${attempts} for ${type} ID ${id}`);

    clearInterval(interval);
  }, POLL_INTERVAL_MS);
}

module.exports = { pollAndVerifyMatch };
