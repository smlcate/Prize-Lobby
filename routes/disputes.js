const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { createDispute } = require('../controllers/disputesController');

router.post('/:id', authenticate, createDispute);

module.exports = router;
