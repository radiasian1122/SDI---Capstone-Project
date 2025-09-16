const {generateUsersRoles} = require('../utils.js')
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('users_roles').del()

    //Default Requestor
    await knex('users_roles').insert([{
        user_id: 1234567890,
        role_id: 3
    },
        {
            user_id: 1234567890,
            role_id: 1
        },
        {
            user_id: 1234567890,
            role_id: 2
        },
        {
            user_id: 1234567890,
            role_id: 4
        },
        {
            user_id: 6666666666,
            role_id: 4
        },
        {
            user_id: 6666666666,
            role_id: 1
        }])

    //Default Drivers
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
        },
        {
            user_id: 7777777777,
            role_id: 4
        },
        {
            user_id: 8888888888,
            role_id: 4
        }])
    await knex('users_roles').insert(generateUsersRoles());
};
