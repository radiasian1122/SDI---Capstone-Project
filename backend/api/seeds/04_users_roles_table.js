const {generateUsersRoles} = require('../utils.js')
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users_roles').del()

    //Default Requestor
    await knex('users_roles').insert({
        user_id: 123456789,
        role_id: 3
    })

    //Default Driver
    await knex('users_roles').insert({
        user_id: 1010101010,
        role_id: 4
    })
  await knex('users_roles').insert(generateUsersRoles());
};
