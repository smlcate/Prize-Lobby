const db = require('../models/db');

exports.getPlatformFee = async (req, res) => {
  try {
    const setting = await db('platform_settings').first();
    res.json(setting);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load settings' });
  }
};

exports.updatePlatformFee = async (req, res) => {
  try {
    const { platform_fee_percent } = req.body;
    await db('platform_settings').update({ platform_fee_percent });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save settings' });
  }
};
