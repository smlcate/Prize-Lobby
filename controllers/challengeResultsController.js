const teamWalletService = require('../services/teamWalletService');
const { logMatch } = require('../services/historyService');
const db = require('../models/db');
const { parseChallengeResult } = require('../utils/resultUtils');

exports.getChallengeResult = async (req, res) => {
  try {
    const userId = req.user.id;
    const challengeId = req.params.id;

    const challenge = await db('challenges').where({ id: challengeId }).first();
    if (!challenge) return res.status(404).json({ error: 'Challenge not found.' });

    const participants = await db('challenges_participants')
      .join('users', 'users.id', 'challenges_participants.user_id')
      .where('challenges_participants.challenge_id', challengeId)
      .select('users.id', 'users.username', 'challenges_participants.gamertag');

    const current = participants.find(p => p.id === userId);
    const opponent = participants.find(p => p.id !== userId);

    if (!current || !opponent) return res.status(403).json({ error: 'Not a participant.' });

    const { user_score: userScore, opponent_score: opponentScore } =
      parseChallengeResult(challenge.result, userId, opponent.id);

    const alreadyDisputed = await db('disputes')
      .where({ challenge_id: challengeId, user_id: userId })
      .first();

    
    // 🧾 Log match history
    await logMatch({
      user_id: userId,
      game: 'Rocket League',
      platform: current.platform || 'unknown',
      mode: '1v1',
      score: userScore,
      win: userScore > opponentScore,
      xp_earned: 50,
      prize_earned: challenge.prize || 0,
      source_type: 'challenge',
      source_id: challengeId
    });

    
    // 💸 Award prize to team if winner is part of a team
    const winnerId = userScore > opponentScore ? userId : opponentId;
    const io = req.app.get('io');
    const winnerTeam = await db('team_members').where({ user_id: winnerId }).first();
    if (winnerTeam) {
      await teamWalletService.recordTransaction(winnerTeam.team_id, challenge.prize || 0, 'challenge_payout', {
        challenge_id: challengeId,
        awarded_to: winnerId
      });
    }

    io.to('user_' + winnerId).emit('wallet:team:credit', {
        team_id: winnerTeam.team_id,
        amount: challenge.prize || 0,
        from: 'system',
        type: 'challenge_payout'
      });
    res.json({
      status: challenge.status,
      userScore,
      opponentScore,
      opponentName: opponent.username,
      alreadyDisputed: !!alreadyDisputed
    });
  } catch (err) {
    console.error('Error in result controller:', err);
    res.status(500).json({ error: 'Internal error' });
  }
};
