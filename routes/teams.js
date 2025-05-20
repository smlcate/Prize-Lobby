const express = require('express');
const router = express.Router();
const controller = require('../controllers/teamsController');
const authenticate = require('../middleware/authenticate');

router.post('/', authenticate, controller.createTeam);
router.get('/mine', authenticate, controller.getMyTeams);
router.get('/:id', authenticate, controller.getTeamRoster);
router.post('/:id/join', authenticate, controller.joinTeam);
router.post('/:id/leave', authenticate, controller.leaveTeam);
router.post('/:id/promote', authenticate, controller.promoteMember);
router.post('/:id/kick', authenticate, controller.kickMember);
router.delete('/:id', authenticate, controller.disbandTeam);
router.get('/:id/wallet', authenticate, async (req, res) => {
  const teamId = req.params.id;
  const teamWalletService = require('../services/teamWalletService');

  try {
    const balance = await teamWalletService.getBalance(teamId);
    const history = await teamWalletService.getTransactionHistory(teamId);
    res.json({ balance, history });
  } catch (err) {
    console.error('❌ Failed to fetch team wallet:', err);
    res.status(500).json({ error: 'Failed to load team wallet' });
  }
});
router.post('/:id/distribute', authenticate, controller.distributeFunds);

module.exports = router;
