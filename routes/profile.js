const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { getProfile } = require('../controllers/profileController');

router.get('/', authenticate, getProfile);

module.exports = router;
