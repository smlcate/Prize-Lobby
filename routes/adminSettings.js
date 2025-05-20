const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const verifyAdmin = require('../middleware/verifyAdmin');
const {
  getPlatformFee,
  updatePlatformFee
} = require('../controllers/adminSettingsController');

router.get('/platform-fee', authenticate, verifyAdmin, getPlatformFee);
router.put('/platform-fee', authenticate, verifyAdmin, updatePlatformFee);

module.exports = router;
