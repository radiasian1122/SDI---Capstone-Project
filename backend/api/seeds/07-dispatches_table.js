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
        approved: false,
        destination: "TA-20"
    },
        {
            requestor_id: 1234567890,
            driver_id: 2222222222,
            vehicle_id: 7,
            approved: false,
            destination: "YTC",
            purpose: "To suffer in the barren wasteland of Yakima"
        },
        {
            requestor_id: 1234567890,
            driver_id: 3333333333,
            vehicle_id: 13,
            approved: false,
            destination: "NTC"
        },
        {
            requestor_id: 1234567890,
            driver_id: 4444444444,
            vehicle_id: 19,
            approved: false,
            destination: "TA-15"
        },
        {
            requestor_id: 1234567890,
            driver_id: 5555555555,
            vehicle_id: 25,
            approved: false,
            start_time: new Date(),
            end_time: '2025-09-09 13:00:00',
            destination: "TA-10",
            purpose: "Land Navigation Training",
            comments: "This is a test comment to help show what it will look like when it's added to the frontend"
        },
        {
            requestor_id: 6666666666,
            driver_id: 6666666666,
            vehicle_id: 33,
            approved: false,
            destination: "TA-10",
        },
        {
            requestor_id: 6666666666,
            driver_id: 7777777777,
            vehicle_id: 31,
            approved: false,
            destination: "TA-10",
            purpose: "Land Navigation Training",
        },
        {
            requestor_id: 6666666666,
            driver_id: 8888888888,
            vehicle_id: 37,
            approved: false,
            destination: "NTC"
        }]);
};
