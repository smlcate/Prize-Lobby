const knex = require('../models/db');
const { startMatchPolling } = require('../lib/startPolling');

async function joinChallenge(req, res) {
  const userId = req.user.id;
  const challengeId = req.params.id;

  try {
    const challenge = await knex('challenges').where({ id: challengeId }).first();
    if (!challenge) return res.status(404).json({ error: 'Challenge not found' });

    const existing = await knex('challenges_participants')
      .where({ challenge_id: challengeId, user_id: userId })
      .first();

    if (existing) return res.status(400).json({ error: 'Already joined' });

    await knex('challenges_participants').insert({
      challenge_id: challengeId,
      user_id: userId,
      gamertag: req.body.gamertag || '' // assuming frontend sends gamertag
    });

    const participants = await knex('challenges_participants')
      .where({ challenge_id: challengeId });

    if (participants.length === 2) {
      await knex('challenges')
        .where({ id: challengeId })
        .update({ status: 'in_progress' });

      startMatchPolling(challengeId);
    }

    res.json({ success: true, joined: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = {
  joinChallenge
};
