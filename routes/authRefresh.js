
const express = require('express');
const router = express.Router();
const controller = require('../controllers/authRefreshController');

router.post('/refresh', controller.refreshToken);

module.exports = router;
