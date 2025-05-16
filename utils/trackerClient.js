const env = process.env.NODE_ENV;

let getRecentMatches;

if (env === 'production') {
  // Real Tracker.gg API
  getRecentMatches = require('./tracker').getRecentMatches;
} else {
  // Dev/testing mock
  getRecentMatches = async (game, platform, gamertag) => {
    const fake = require('../lib/trackerStub');
    return [await fake(gamertag)];
  };
}

module.exports = { getRecentMatches };
