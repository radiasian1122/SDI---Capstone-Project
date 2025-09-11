const {generateDriverQuals} = require('../utils.js')
const driverIds = [1111111111, 2222222222, 3333333333, 4444444444, 5555555555]
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex("driver_quals").del();
    for (let i = 0; i < driverIds.length; i++) {
        for (let j = 0; j < 9; j++) {

            await knex("driver_quals").insert({
                user_id: driverIds[i],
                qual_id: j + 1
            })
        }

    }
    await knex("driver_quals").insert(generateDriverQuals());
};
