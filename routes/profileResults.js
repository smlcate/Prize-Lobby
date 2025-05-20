const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { getRecentCompleted } = require('../controllers/profileResultsController');

router.get('/recent-completed', authenticate, getRecentCompleted);

module.exports = router;
