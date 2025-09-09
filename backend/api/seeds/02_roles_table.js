/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('roles').del()
    await knex('roles').insert([
        {id: 1, roles: 'requestor'},
        {id: 2, roles: 'dispatcher'},
        {id: 3, roles: 'approver'},
        {id: 4, roles: 'driver'}
    ]);
};
