const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminWithdrawalsController');
const authenticate = require('../middleware/authenticate');
const verifyAdmin = require('../middleware/verifyAdmin');

router.get('/', authenticate, verifyAdmin, controller.getAllWithdrawals);
router.post('/:id/approve', authenticate, verifyAdmin, controller.approveWithdrawal);
router.post('/:id/deny', authenticate, verifyAdmin, controller.denyWithdrawal);

module.exports = router;
