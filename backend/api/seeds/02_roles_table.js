/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('roles').del()
  await knex('roles').insert([
    {id: 1, roles: 'driver'},
    {id: 2, roles: 'leader'},
    {id: 3, roles: 'master-driver'},
  ]);
};
