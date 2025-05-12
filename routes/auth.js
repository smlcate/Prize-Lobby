const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me', verifyToken, authController.getProfile);

router.get('/me', verifyToken, async (req, res) => {
  const user = await db('users').where({ id: req.user.id }).first();
  res.json({ email: user.email, id: user.id, is_admin: user.is_admin });
});


module.exports = router;
