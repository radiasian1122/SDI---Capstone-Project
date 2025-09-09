/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
import User from '../utils.js'
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    { dod_id: User.userID(), username: User.username(), password: User.password(), uic: 'NF5HA0', first_name: User.firstname(), last_name: User.lastname() },
    { dod_id: User.userID(), username: User.username(), password: User.password(), uic: 'NF5HA0', first_name: User.firstname(), last_name: User.lastname() },
    { dod_id: User.userID(), username: User.username(), password: User.password(), uic: 'NF5HA0', first_name: User.firstname(), last_name: User.lastname() },
    { dod_id: User.userID(), username: User.username(), password: User.password(), uic: 'NF5HB0', first_name: User.firstname(), last_name: User.lastname() },
    { dod_id: User.userID(), username: User.username(), password: User.password(), uic: 'NF5HB0', first_name: User.firstname(), last_name: User.lastname() },
    { dod_id: User.userID(), username: User.username(), password: User.password(), uic: 'NF5HB0', first_name: User.firstname(), last_name: User.lastname() },
    { dod_id: User.userID(), username: User.username(), password: User.password(), uic: 'NF5HC0', first_name: User.firstname(), last_name: User.lastname() },
    { dod_id: User.userID(), username: User.username(), password: User.password(), uic: 'NF5HC0', first_name: User.firstname(), last_name: User.lastname() },
    {dod_id: User.userID(), username: User.username(), password: User.password(), uic: 'NF5HC0', first_name: User.firstname(), last_name: User.lastname()},

  ]);
};
