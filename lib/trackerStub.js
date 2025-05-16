let sharedFakeMatchId = null;

module.exports = async function getRecentRocketLeagueMatch(gamertag) {
  if (!sharedFakeMatchId) {
    sharedFakeMatchId = 'fake-match-' + Math.floor(Date.now() / 10000);
  }

  const randomGoals = Math.floor(Math.random() * 5);

  return {
    id: sharedFakeMatchId,
    stats: {
      core: {
        goals: randomGoals
      }
    }
  };
};