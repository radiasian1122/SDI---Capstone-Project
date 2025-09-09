/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
import User from '../utils.js'
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users_roles').del()
  await knex('users_roles').insert([
    { user_id: User.userID(), role_id: 1},
    { user_id: User.userID(), role_id: 1},
    { user_id: User.userID(), role_id: 1},
    { user_id: User.userID(), role_id: 1},
    { user_id: User.userID(), role_id: 2},
    { user_id: User.userID(), role_id: 2},
    { user_id: User.userID(), role_id: 1},
    { user_id: User.userID(), role_id: 1},
    {user_id: User.userID(), role_id: 3}

  ]);
};
