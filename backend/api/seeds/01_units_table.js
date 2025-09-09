/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('units').del()
  await knex('units').insert([
      {uic: "NF5HA0", common_name: 'A-2/75'},
      {uic: "NF5HB0", common_name: 'B-2/75'},
      {uic: "NF5HC0", common_name: 'C-2/75'}
  ]);
};
