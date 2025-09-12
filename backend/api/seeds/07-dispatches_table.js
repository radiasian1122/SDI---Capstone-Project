/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('dispatches').del()
    await knex('dispatches').insert([{
        requestor_id: 1234567890,
        driver_id: 1111111111,
        vehicle_id: 1,
        approved: false
    },
        {
            requestor_id: 1234567890,
            driver_id: 2222222222,
            vehicle_id: 7,
            approved: false
        },
        {
            requestor_id: 1234567890,
            driver_id: 3333333333,
            vehicle_id: 13,
            approved: false
        },
        {
            requestor_id: 1234567890,
            driver_id: 4444444444,
            vehicle_id: 19,
            approved: false
        },
        {
            requestor_id: 1234567890,
            driver_id: 5555555555,
            vehicle_id: 25,
            approved: false,
            start_time: new Date(),
            end_time: '2025-09-09 13:00:00'
        }]);
};
