/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
import Vic from '../utils.js'
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('vehicles').del()
  await knex('vehicles').insert([
    {id: 1, uic: '', platform: '', variant: '', bumper_no: Vic.bumper(), boolean: Vic.deadlined()},

  ]);
};
