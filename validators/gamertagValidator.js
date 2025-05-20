
const Joi = require('joi');

const gamertagSchema = Joi.object({
  platform: Joi.string().valid('xbox', 'psn', 'steam', 'epic', 'riot').required(),
  tag: Joi.string().min(3).max(32).required()
});

module.exports = gamertagSchema;
