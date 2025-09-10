const knex = require('knex');
const knexConfig = require('./knexfile');

const environment = process.env.NODE_ENV || 'docker';
const db = knex(knexConfig[environment]);

module.exports = db;