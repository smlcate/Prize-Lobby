const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const verifyAdmin = require('../middleware/verifyAdmin');
const controller = require('../controllers/adminController');

router.get('/events', authenticate, verifyAdmin, controller.getAllEvents);
router.get('/challenges', authenticate, verifyAdmin, controller.getAllChallenges);
router.get('/bracket-matches', authenticate, verifyAdmin, controller.getAllBracketMatches);
router.post('/matches/:id/verify', authenticate, verifyAdmin, controller.verifyMatchManually);
router.get('/settings/platform-fee', authenticate, verifyAdmin, controller.getPlatformFee);
router.get('/withdrawals', authenticate, verifyAdmin, controller.getAllWithdrawals);
router.put('/withdrawals/:id/approve', authenticate, verifyAdmin, controller.approveWithdrawal);
router.put('/withdrawals/:id/reject', authenticate, verifyAdmin, controller.rejectWithdrawal);
router.get('/transactions', authenticate, verifyAdmin, controller.getAllTransactions);

module.exports = router;
