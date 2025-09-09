const {generateVehicles} = require('../utils')
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
import Vic from '../utils.cjs'
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('vehicles').del()
  await knex('vehicles').insert(generateVehicles());
};
