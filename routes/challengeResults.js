const express = require('express');
const router = express.Router();
const { getChallengeResult } = require('../controllers/challengeResultsController');
const authenticate = require('../middleware/authenticate');

router.get('/:id/result', authenticate, getChallengeResult);

module.exports = router;
