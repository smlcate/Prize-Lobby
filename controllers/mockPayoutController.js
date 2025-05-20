const { distributeChallengePrizeWithTeams } = require('../utils/payout_with_teams');
const { distributeEventPrizeWithTeams } = require('../utils/payout_with_teams_event');

exports.mockChallengePayout = async (req, res) => {
  try {
    const result = await distributeChallengePrizeWithTeams(req.params.id);
    res.json({ success: true, result });
  } catch (err) {
    console.error('❌ Challenge payout failed:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.mockEventPayout = async (req, res) => {
  try {
    const result = await distributeEventPrizeWithTeams(req.params.id);
    res.json({ success: true, result });
  } catch (err) {
    console.error('❌ Event payout failed:', err);
    res.status(500).json({ error: err.message });
  }
};