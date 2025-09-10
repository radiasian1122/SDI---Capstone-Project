/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('dispatches').del()
    await knex('dispatches').insert({
        requestor_id: 1234567890,
        driver_id: 1010101010,
        vehicle_id: 1,
        approved: true
    });
};
