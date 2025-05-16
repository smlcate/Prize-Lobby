const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/authenticate');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me', verifyToken, authController.getProfile);

module.exports = router;
