const db = require('../models/db');

module.exports = async function verifyAdmin(req, res, next) {
  try {
    const user = await db('users').where({ id: req.user.id }).first();
    if (!user || !user.is_admin) {
      return res.status(403).json({ error: 'Admin access only' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: 'Server error during admin check' });
  }
};
