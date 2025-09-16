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
        dod_id: 1234567890,
        username: 'alec-somers',
        password: 'password',
        uic: 'NF5HA0',
        first_name: 'Alec',
        last_name: 'Somers'
    })

    //Default Drivers
    await knex('users').insert([{
        dod_id: 1111111111,
        uic: 'NF5HA0',
        first_name: 'Adam',
        last_name: 'Pembrose'
    },
        {
            dod_id: 2222222222,
            uic: 'NF5HB0',
            first_name: 'Bob',
            last_name: 'Driver'
        },
        {
            dod_id: 3333333333,
            uic: 'NF5HC0',
            first_name: 'Charlie',
            last_name: 'Fontaine'
        },
        {
            dod_id: 4444444444,
            uic: 'NF5HC0',
            first_name: 'David',
            last_name: 'Fincher'
        },
        {
            dod_id: 5555555555,
            uic: 'NF5HC0',
            first_name: 'Eve',
            last_name: 'Greene'
        },
        {
            dod_id: 6666666666,
            uic: 'NF5HC0',
            first_name: 'Frank',
            last_name: 'Castle'
        },
        {
            dod_id: 7777777777,
            uic: 'NF5HC0',
            first_name: 'George',
            last_name: 'Castellanos'
        },
    {
            dod_id: 8888888888,
            uic: 'NF5HC0',
            first_name: 'Henry',
            last_name: 'Hill'
    }])
  await knex('users').insert(masterUsersList);
};
