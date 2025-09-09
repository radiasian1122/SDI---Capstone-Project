/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('roles').del()
    await knex('roles').insert([
        {role_name: 'requestor'},
        {role_name: 'dispatcher'},
        {role_name: 'approver'},
        {role_name: 'driver'}
    ]);
};
