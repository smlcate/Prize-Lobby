const jwt = require('jsonwebtoken');
const { JWT_SECRET = 'your_super_secret_jwt_key' } = process.env;

function getToken(id) {
  return jwt.sign({ id }, JWT_SECRET);
}

module.exports = { getToken };
