const knex = require('knex');
const config = require('../knexfile');

const db = knex(config.development); // or dynamically use NODE_ENV

module.exports = db;
