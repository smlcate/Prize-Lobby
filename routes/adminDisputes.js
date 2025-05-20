const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const verifyAdmin = require('../middleware/verifyAdmin');
const { getAllDisputes } = require('../controllers/adminDisputesController');

router.get('/disputes', authenticate, verifyAdmin, getAllDisputes);

module.exports = router;
