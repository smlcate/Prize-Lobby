const express = require('express');
const router = express.Router();
const controller = require('../controllers/challengesController');
const authenticate = require('../middleware/authenticate');

router.get('/', controller.getChallenges);
router.post('/:id/start', authenticate, controller.startChallenge);
router.post('/:id/join', authenticate, controller.joinChallenge);

module.exports = router;