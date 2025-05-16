const axios = require('axios');

const TRACKER_API_KEY = process.env.TRACKER_API_KEY || 'your_tracker_key_here';
const TRACKER_API_URL = 'https://public-api.tracker.gg/v2/apex/standard/profile';

/**
 * Validate an Apex Legends gamertag.
 * Route: GET /api/gamertags/validate/apex/:platform/:username
 */
exports.validateApexGamertag = async (req, res) => {
  const { platform, username } = req.params;

  try {
    const response = await axios.get(`${TRACKER_API_URL}/${platform}/${encodeURIComponent(username)}`, {
      headers: {
        'TRN-Api-Key': TRACKER_API_KEY,
      },
    });

    if (response.status === 200) {
      return res.json({ valid: true, data: response.data });
    } else {
      return res.status(404).json({ valid: false, error: 'User not found.' });
    }
  } catch (err) {
    const code = err.response?.status || 500;
    return res.status(code).json({ valid: false, error: 'Gamertag not found or API error.', details: err.message });
  }
};

/**
 * Fetch recent Apex Legends matches for a given user.
 * Route: GET /api/matches/apex/:platform/:username
 */
exports.getRecentMatches = async (req, res) => {
  const { platform, username } = req.params;

  try {
    const response = await axios.get(
      `https://public-api.tracker.gg/v2/apex/standard/matches/${platform}/${encodeURIComponent(username)}`,
      {
        headers: {
          'TRN-Api-Key': TRACKER_API_KEY,
        },
      }
    );

    const matches = response.data?.data?.matches || [];

    // Return trimmed match data for use in validation
    const parsed = matches.map(match => ({
      id: match.id,
      metadata: {
        map: match.metadata?.mapName,
        mode: match.metadata?.playlistName,
        timestamp: match.metadata?.timestamp,
      },
      stats: {
        kills: match.stats?.kills?.value,
        damage: match.stats?.damage?.value,
        placement: match.stats?.rankScore?.metadata?.rankName || null,
        win: match.stats?.rankScore?.value === 1000,  // rough example
      }
    }));

    return res.json({ matches: parsed });
  } catch (err) {
    const code = err.response?.status || 500;
    return res.status(code).json({ error: 'Failed to fetch matches', details: err.message });
  }
};
