const {generateVehicles} = require('../utils.js')
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('vehicles').del()
  await knex('vehicles').insert(generateVehicles());
};
