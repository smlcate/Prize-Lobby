
const axios = require('axios');
const { delay } = require('./helpers');
const { updateParticipantWithMatch } = require('../services/matchService');

const TRACKER_API_BASE = 'https://api.tracker.gg/api/v2';

async function pollForMatchStart({ game, platform, gamertags, userIds, pollLimit = 12 }) {
  let attempt = 0;

  while (attempt < pollLimit) {
    for (let i = 0; i < gamertags.length; i++) {
      const gamertag = gamertags[i];
      try {
        const res = await axios.get(`${TRACKER_API_BASE}/${game}/standard/profile/${platform}/${gamertag}`);
        const matches = res?.data?.data?.matches || [];

        for (const match of matches) {
          const matchTime = new Date(match.metadata.timestamp);
          const matchId = match.id;
          const isRecent = Date.now() - matchTime.getTime() < 5 * 60 * 1000;

          if (matchId && isRecent) {
            await updateParticipantWithMatch(userIds[i], matchId, matchTime);
            return matchId;
          }
        }
      } catch (err) {
        console.error(`Error polling match for ${gamertag}:`, err.response?.data || err.message);
      }
    }

    attempt++;
    await delay(5000);
  }

  return null;
}

module.exports = { pollForMatchStart };
