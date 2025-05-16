const jwt = require('jsonwebtoken');
const db = require('../../models/db');

async function getTokenForUser(username) {
  const user = await db('users').where({ username }).first();
  if (!user) throw new Error(`User ${username} not found`);
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your_jwt_secret');
  return token;
}

module.exports = { getTokenForUser };
