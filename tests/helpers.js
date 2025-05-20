const jwt = require('jsonwebtoken');
const db = require('../models/db');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key';

/**
 * Generates a valid JWT token for a given user's email.
 * @param {string} email - The email of the user to authenticate.
 * @returns {Promise<string>} - A signed JWT token.
 */
async function getTokenForUser(email) {
  const user = await db('users').where({ email }).first();
  if (!user) {
    throw new Error(`User with email ${email} not found in test database.`);
  }

  const payload = { id: user.id };
  return jwt.sign(payload, JWT_SECRET);
}

module.exports = {
  getTokenForUser
};
