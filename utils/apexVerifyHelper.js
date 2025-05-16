
'use strict';

const axios = require('axios');
const db = require('../models/db');

const TRACKER_API_KEY = process.env.TRACKER_API_KEY;
const TRACKER_MATCH_URL = 'https://public-api.tracker.gg/v2/apex/standard/matches';

async function verifyApexMatch(userId, platform, username, challengeOrMatch) {
  const idField = challengeOrMatch.challenge_id ? 'challenge_id' : 'match_id';
  const relatedId = challengeOrMatch[idField];
  const startTime = new Date(challengeOrMatch.started_at || challengeOrMatch.created_at);

  try {
    const url = TRACKER_MATCH_URL + '/' + platform + '/' + encodeURIComponent(username);
    const res = await axios.get(url, {
      headers: { 'TRN-Api-Key': TRACKER_API_KEY }
    });

    const matches = res.data?.data?.matches || [];

    const match = matches.find(m => {
      const matchTime = new Date(m.metadata?.timestamp);
      return matchTime > startTime;
    });

    if (!match) {
      return { success: false, reason: 'No valid match found after event start' };
    }

    const kills = match.stats?.kills?.value || 0;
    const damage = match.stats?.damage?.value || 0;
    const match_id = match.id;

    if (idField === 'challenge_id') {
      await db('challenge_results').insert({
        user_id: userId,
        challenge_id: relatedId,
        result: JSON.stringify({ kills, damage, match_id }),
        verified: true
      }).onConflict(['user_id', 'challenge_id']).merge();
    } else {
      await db('bracket_matches')
        .where({ id: relatedId })
        .update({ verified: true, score_data: JSON.stringify({ kills, damage, match_id }) });
    }

    return { success: true, kills, damage, match_id };
  } catch (err) {
    console.error('Apex match verification failed:', err);
    return { success: false, reason: err.message };
  }
}

module.exports = { verifyApexMatch };
