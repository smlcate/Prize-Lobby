const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const authenticate = require('../middleware/authenticate');

router.get('/balance', authenticate, walletController.getWalletBalance);
router.post('/deposit-intent', authenticate, walletController.createDepositIntent);
router.post('/withdraw', authenticate, walletController.submitWithdrawalRequest);

module.exports = router;
