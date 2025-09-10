const {masterUsersList} = require('../utils.js')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
    await knex('users').insert({
        dod_id: 123456789,
        username: 'alec-somers',
        password: 'password',
        uic: 'NF5HA0',
        first_name: 'Alec',
        last_name: 'Somers'
    })
  await knex('users').insert(masterUsersList);
};
