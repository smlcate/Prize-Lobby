const db = require('../models/db');
const { pollLeagueMatch } = require('../services/leagueVerifier');

exports.getChallenges = async (req, res) => {
  try {
    const challenges = await db('challenges')
      .orderBy('created_at', 'desc')
      .limit(100);
    res.json(challenges);
  } catch (err) {
    console.error('Error fetching challenges:', err);
    res.status(500).json({ error: 'Failed to fetch challenges' });
  }
};

exports.startChallenge = async (req, res) => {
  const challengeId = req.params.id;
  const userId = req.user.id;

  try {
    const challenge = await db('challenges').where({ id: challengeId }).first();
    if (!challenge) return res.status(404).json({ error: 'Challenge not found' });

    if (challenge.creator_id !== userId && !req.user.is_admin) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await db('challenges').where({ id: challengeId }).update({ status: 'started' });

    // Start match verification logic (non-blocking)
    pollLeagueMatch(challengeId);

    res.json({ message: 'Challenge started and verification initiated' });
  } catch (err) {
    console.error('Error starting challenge:', err);
    res.status(500).json({ error: 'Failed to start challenge' });
  }
};

exports.joinChallenge = async (req, res) => {
  const userId = req.user.id;
  const challengeId = req.params.id;

  const trx = await db.transaction();
  try {
    const challenge = await trx('challenges').where({ id: challengeId }).first();
    if (!challenge) return res.status(404).json({ error: 'Challenge not found' });
    if (challenge.status !== 'open') return res.status(400).json({ error: 'Challenge is not open for joining' });

    const alreadyJoined = await trx('challenge_participants')
      .where({ user_id: userId, challenge_id: challengeId })
      .first();

    if (alreadyJoined) {
      return res.status(400).json({ error: 'You have already joined this challenge' });
    }

    const gamertag = await trx('gamertags')
      .where({ user_id: userId, platform: challenge.platform })
      .first();

    if (!gamertag) {
      return res.status(400).json({ error: `No gamertag found for platform: ${challenge.platform}` });
    }

    const wallet = await trx('wallets').where({ user_id: userId }).first();
    if (!wallet || wallet.balance < challenge.entry_fee) {
      return res.status(400).json({ error: 'Insufficient balance to join challenge' });
    }

    await trx('wallets')
      .where({ user_id: userId })
      .update({ balance: wallet.balance - challenge.entry_fee });

    await trx('transactions').insert({
      user_id: userId,
      amount: -challenge.entry_fee,
      type: 'challenge_entry',
      metadata: JSON.stringify({ challenge_id: challengeId })
    });

    await trx('challenge_participants').insert({
      user_id: userId,
      challenge_id: challengeId
    });

    await trx.commit();
    res.json({ message: 'Successfully joined the challenge' });
  } catch (err) {
    await trx.rollback();
    console.error('Error joining challenge:', err);
    res.status(500).json({ error: 'Failed to join challenge' });
  }
};