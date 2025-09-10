const {masterUsersList} = require('../utils.js')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()

    //Default Requestor
    await knex('users').insert({
        dod_id: 123456789,
        username: 'alec-somers',
        password: 'password',
        uic: 'NF5HA0',
        first_name: 'Alec',
        last_name: 'Somers'
    })

    //Default Driver
    await knex('users').insert({
        dod_id: 1010101010,
        username: 'adam-driver',
        password: 'password',
        uic: 'NF5HA0',
        first_name: 'Adam',
        last_name: 'Driver'
    })
  await knex('users').insert(masterUsersList);
};
