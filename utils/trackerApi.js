// utils/trackerApi.js;
const axios = require('axios');

const TRACKER_API_KEY = process.env.TRACKER_API_KEY; // set this in your .env;
const BASE_URL = 'https://public-api.tracker.gg/v2/rocket-league/standard/profile';

const getRocketLeagueStats = async (platform, username) => {
  try {
    const url = `${BASE_URL}/${platform}/${encodeURIComponent(username)}`;
    const response = await axios.get(url, {
      headers: {
        'TRN-Api-Key': TRACKER_API_KEY;
      }
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error fetching Rocket League stats:', error.response?.data || error.message);
    throw error;
  }
};

module.exports = { getRocketLeagueStats };