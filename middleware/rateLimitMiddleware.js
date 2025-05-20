const rateLimit = require('express-rate-limit');

exports.withdrawLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 1,
  message: 'Too many withdrawal requests. Please wait a moment.',
});

exports.challengeJoinLimiter = rateLimit({
  windowMs: 10 * 1000,
  max: 1,
  message: 'Too many join attempts. Please wait a moment.',
});

exports.challengeDisputeLimiter = rateLimit({
  windowMs: 15 * 1000,
  max: 1,
  message: 'Too many disputes submitted. Please wait.',
});

exports.matchSubmitLimiter = rateLimit({
  windowMs: 20 * 1000,
  max: 1,
  message: 'Too many match submissions. Please wait.',
});

exports.gamertagAddLimiter = rateLimit({
  windowMs: 10 * 1000,
  max: 1,
  message: 'Too many gamertag updates. Please wait.',
});
