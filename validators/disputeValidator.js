
const Joi = require('joi');

const disputeSchema = Joi.object({
  reason: Joi.string().min(5).max(250).required()
});

module.exports = disputeSchema;
