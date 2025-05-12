const db = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    await db('users').insert({
      username,
      email,
      password: hash
    });

    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ error: 'Signup failed', details: err.detail || err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db('users').where({ email }).first();

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '1d'
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await db('users').where({ id: req.user.id }).first();

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Optional: include gamertags
    const gamertags = await db('gamertags').where({ user_id: user.id });

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      gamertags
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile', details: err.message });
  }
};


module.exports = {
  signup,
  login,
  getProfile
};
