const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { getUserProfile } = require('../controllers/usersController');

router.get('/me', authenticate, getUserProfile);

module.exports = router;
