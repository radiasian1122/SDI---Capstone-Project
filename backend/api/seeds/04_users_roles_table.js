const {generateUsersRoles} = require('../utils.js')
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
import User from '../utils.cjs'
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users_roles').del()
  await knex('users_roles').insert(generateUsersRoles());
};
