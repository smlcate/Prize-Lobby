
// utils/resultUtils.js

function parseChallengeResult(rawResult, userId, opponentId) {
  let user_score = 0;
  let opponent_score = 0;

  try {
    const result = JSON.parse(rawResult || '{}');
    const scores = Array.isArray(result.scores) ? result.scores : [];

    for (const score of scores) {
      if (score.user_id === userId) user_score = score.score;
      if (score.user_id === opponentId) opponent_score = score.score;
    }
  } catch (err) {
    console.error('Failed to parse challenge result:', err);
  }

  return { user_score, opponent_score };
}

module.exports = { parseChallengeResult };
