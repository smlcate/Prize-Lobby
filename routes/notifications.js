// routes/notifications.js
const express = require('express');
const router = express.Router();
const db = require('../models/db');
const authenticate = require('../middleware/authenticate');

// GET all notifications
router.get('/', authenticate, async (req, res) => {
  try {
    const user_id = req.user.id;
    const notes = await db('notifications').where({ user_id }).orderBy('created_at', 'desc');
    res.json(notes);
  } catch (err) {
    console.error('[GET /notifications]', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// POST to mark as read
router.post('/:id/read', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    await db('notifications')
      .where({ id, user_id })
      .update({ is_read: true });

    res.json({ success: true });
  } catch (err) {
    console.error('[POST /notifications/:id/read]', err);
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

module.exports = router;
