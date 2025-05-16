const axios = require('axios');

// Optional: only if dotenv isn't already loaded in server.js;
require('dotenv').config();

const trackerKey = process.env.TRACKER_API_KEY;

async function getRecentMatches(game, platform, gamertag) {
  const url = `https://public-api.tracker.gg/v2/${game}/standard/profile/${platform}/${encodeURIComponent(gamertag)}/matches`;

  try {
    const res = await axios.get(url, {
      headers: { 'TRN-Api-Key': trackerKey }
    });
    return res.data.data.matches;
  } catch (err) {
    console.error('Tracker.gg API error:', err.response?.data || err.message);
    return null;
  }
}

module.exports = { getRecentMatches };