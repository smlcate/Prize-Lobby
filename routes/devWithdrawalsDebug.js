const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const verifyAdmin = require('../middleware/verifyAdmin');
const { getAllWithdrawals } = require('../controllers/devWithdrawalsDebugController');

router.get('/withdrawals/all', authenticate, verifyAdmin, getAllWithdrawals);

module.exports = router;
