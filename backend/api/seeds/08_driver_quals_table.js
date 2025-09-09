const {generateDriverQuals} = require('../utils.js')
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("driver_quals").del();
  await knex("driver_quals").insert(generateDriverQuals());
};
