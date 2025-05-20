const express = require('express');
const router = express.Router();
const { getBracketData } = require('../controllers/bracketController');
const authenticate = require('../middleware/authenticate');

router.get('/:event_id', authenticate, getBracketData);

module.exports = router;
