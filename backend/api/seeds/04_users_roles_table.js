const {generateUsersRoles} = require('../utils.js')
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('users_roles').del()

    //Default Requestor
    await knex('users_roles').insert({
        user_id: 1234567890,
        role_id: 3
    })

    //Default Driver
    await knex('users_roles').insert([{
        user_id: 1111111111,
        role_id: 4
    },
        {
            user_id: 2222222222,
            role_id: 4
        }, {
            user_id: 3333333333,
            role_id: 4
        },
        {
            user_id: 4444444444,
            role_id: 4
        },
        {
            user_id: 5555555555,
            role_id: 4
        }])
    await knex('users_roles').insert(generateUsersRoles());
};
