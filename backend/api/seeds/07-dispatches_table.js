/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('dispatches').del()
  await knex('dispatches').insert({
        user_id: 123456789,
      vehicle_id: 1,
      approved: true
});
};
