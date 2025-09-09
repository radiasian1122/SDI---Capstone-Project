/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('roles').del()
  await knex('roles').insert([
    {roles: 'rowValue1'},
    {roles: 'rowValue2'},
    {roles: 'rowValue3'}
  ]);
};
