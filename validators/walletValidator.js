
const Joi = require('joi');

const withdrawalSchema = Joi.object({
  amount: Joi.number().integer().min(100).required() // 100 cents = $1 minimum
});

const depositSchema = Joi.object({
  amount: Joi.number().integer().min(100).required()
});

module.exports = {
  withdrawalSchema,
  depositSchema
};
