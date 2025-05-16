// File: services/trackerService.js

const axios = require('axios');
const TRACKER_API_KEY = process.env.TRACKER_API_KEY;

async function verifyApexMatch(gamertag, platform) {
  try {
    console.log(`[Apex Verify] Checking stats for ${gamertag} on ${platform}...`);

    const res = await axios.get(
      `https://public-api.tracker.gg/v2/apex/standard/profile/${platform}/${gamertag}`,
      {
        headers: {
          'TRN-Api-Key': TRACKER_API_KEY
        }
      }
    );

    const matches = res.data?.data?.segments?.filter(seg => seg.type === 'overview');
    if (!matches || matches.length === 0) {
      console.warn('[Apex Verify] No recent matches found.');
      return null;
    }

    const latest = matches[0];
    return {
      verified: true,
      kills: latest.stats.kills?.value ?? 0,
      damage: latest.stats.damage?.value ?? 0
    };
  } catch (err) {
    console.error('[Apex Verify] Error:', err.response?.data || err.message);
    return null;
  }
}

async function verifyRocketLeagueMatch(gamertag, platform) {
  console.log(`[RL Verify] This is a placeholder for Rocket League verification for ${gamertag} on ${platform}.`);
  return {
    verified: true,
    score: Math.floor(Math.random() * 1000)
  };
}

module.exports = {
  verifyApexMatch,
  verifyRocketLeagueMatch
};
