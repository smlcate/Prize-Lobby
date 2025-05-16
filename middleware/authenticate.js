const jwt = require('jsonwebtoken');
const knex = require('../models/db');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

module.exports = async function(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    console.log('🔐 Incoming token:', token);
    console.log('🔐 Using JWT_SECRET:', JWT_SECRET);

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await knex('users').where({ id: decoded.id }).first();

    if (!user) {
      console.error('❌ User not found for decoded token ID:', decoded.id);
      return res.status(401).json({ error: 'Invalid user' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('❌ JWT verification failed:', err.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};
