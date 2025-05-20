const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { handleStripeWebhook } = require('../controllers/webhookController');

router.use(bodyParser.raw({ type: 'application/json' }));
router.post('/', handleStripeWebhook);

module.exports = router;
